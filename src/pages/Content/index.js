import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { printLine } from './modules/print';
import { decodedTextSpanIntersectsWith } from 'typescript';
import styled from 'styled-components';

console.log('Thu Phi Extension Loaded!');

/**
 * ! Styled component
 */
const Button = styled.button`
  background: #fe5955;
  border: 1px solid #ccc;
  borderradius: 2px;
  color: white;
  padding: 4px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: white;
    background: red;
  }
`;

const StyledA = styled.a`
  background: #fe5955;
  border: 1px solid #ccc;
  borderradius: 2px;
  color: white;
  padding: 4px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: white;
    background: red;
  }
`;

/**
 * ! Change page' style
 */
var style = document.createElement('style');
style.innerHTML = `
select[name="MA_LOAI_THANH_TOAN"] {
font-weight: bold !important;
color: red !important;
}
 
input[name="SO_TK_HQ"] {
font-weight: bold !important;
color: red !important;
}
 
.SHOW_TIEN_TEXT {
font-weight: bold !important;
color: red !important;
border: 1px solid #eee;
border-radius: 5px;
padding: 5px;
background: #dedede
}
 
[class^="TR_"] :nth-child(5) {
font-weight: bold;
color: red;
text-align: center;
}
 
[class^="TR_"] {
font-weight: normal;
}
 
#TBLDANHSACH .bold :nth-child(3) {
font-weight: bold;
color: red;
text-align: center;
}
 
#TBLDANHSACH .bold :nth-child(1) {
font-weight: bold;
color: blue;
text-align: center;
}
`;
document.head.appendChild(style);

/**
 * ! Create shorcut keys
 */
const shorcutKeys = (e) => {
  //Check if shorcut is pressed
  try {
    if ((e.ctrlKey && e.keyCode == 219) || e.keyCode == 219) {
      //Click the element Ctrl + [
      console.log('Tạo biên lai clicked');
      document.getElementsByClassName('btn btn-primary btn-primary')[2].click();
    }

    if ((e.ctrlKey && e.keyCode == 221) || e.keyCode == 221) {
      if (
        document.getElementsByClassName('form-control input-sm')[13].value ==
        'CK'
      ) {
        alert(`Hình thức thanh toán là Chuyển khoản a a a á!`);
      }
      console.log('Lưu lại clicked');
      document
        .getElementsByClassName('btn btn-primary mr10px btn-padding')[0]
        .click();
    }

    //Ctrl + \
    if ((e.ctrlKey && e.keyCode == 220) || e.keyCode == 220) {
      console.log('Phát hành clicked');
      // document
      //   .getElementsByClassName(
      //     'btn btn-success mr10px btn-padding btn-issued-invoice pull-left'
      //   )[0]
      //   .click();
      document.getElementById('testButton').click();
    }

    // Button /
    if (e.keyCode == 191) {
      console.log('One-click clicked');
      document.getElementById('one-click').click();
    }

    //' Button
    if (e.keyCode == 222) {
      const currentURL = window.location.href;
      if (currentURL.includes('10.10.10.20')) {
        window.location.href =
          'http://10.10.10.20:8221/tim-kiem-to-khai-nop-phi';
      } else {
        window.location.href =
          'http://thuphi.haiphong.gov.vn:8221/tim-kiem-to-khai-nop-phi';
      }
    }
  } catch (error) {
    console.log('Có lỗi xảy ra: ' + error.message);
  }
};

// register the handler
document.addEventListener('keyup', shorcutKeys, false);

/**
 * ! Get extension ID
 */
const extensionID = chrome.runtime.id;

// printLine("Using the 'printLine' function from the Print Module");

/*
! Gett domain from URL for sending request to
*/
//URL for sending request
const apiURL = window.location.hostname;

//Correct URL for displaying the extension
const correctURL = document.URL.includes('tim-kiem-to-khai-nop-phi')
  ? 'block'
  : 'none';

const isURL = document.URL.includes('cap-nhat-thong-tin-bien-lai-dien-tu')
  ? 'block'
  : 'none';

/**
 * ! Disable some uncessary field
 */
// Ma DN
try {
  document.getElementsByName('MA_DN')[0].style.display = 'none';
  document.getElementsByClassName(
    'btn btn-success btnPhatHanhBienLaiTheoLo'
  )[0].style.display = 'none';
} catch {}

const cardBody = document.getElementsByClassName('card-body')[0];
const capnhatBody = document.getElementsByClassName(
  'card-footer text-right'
)[0];

// Main Extension Content
/**
 * ! For sending request with verification and cookies info
 */

axios.defaults.withCredentials = true;
const verificationToken = document.querySelector(
  '[name=__RequestVerificationToken]'
).value;

/**
 * ! The Components
 */
// Components
const ContentReact = () => {
  const [listTK, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBL, setBL] = useState('');
  const [selectedList, setSelected] = useState([]);

  /**
   * ! Load current List from Local Storage
   */
  useEffect(() => {
    // console.log('effect');
    setList(
      JSON.parse(window.localStorage.getItem('danh_sach')) !== null
        ? JSON.parse(window.localStorage.getItem('danh_sach'))
        : []
    );
    // console.log(listTK);
  }, []);

  //---Get bill number and add it to the array
  //Function to get info of a customs declaration number
  const getAndAdd = async (soToKhai) => {
    //Check if soToKhai is already added
    try {
      const addedList = listTK.map((element) => element.SO_TKHQ);
      // console.log(addedList);
      if (addedList.includes(soToKhai)) {
        alert('Tờ khai đã được thêm!');
        return;
      }
    } catch {}

    /**
     * ! Getting declaration info
     */
    //convert soToKhai to form-data for sending POST request
    const data = new FormData();
    data.append('SO_TK', soToKhai);
    try {
      setLoading(true);
      const response = await axios.post(
        'http://' + apiURL + ':8221/DToKhaiNopPhi/GetThongBaoNP_TaoBienLai/',
        data,
        {
          headers: {
            __RequestVerificationToken: verificationToken,
          },
          withCredentials: true,
        }
      );
      printLine(response);
      response.data.code !== 1
        ? alert('Có lỗi xảy ra trong quá trình lấy thông tin!')
        : setList(listTK.concat(response.data.DANHSACH));
      if (response !== undefined) setLoading(false);
    } catch (error) {
      alert(error.message);
      // window.location.reload();
    }
  };

  /**
   * ! Get info of a specific declaration number
   */
  const getInfo = async (numTK) => {
    const data = new FormData();
    data.append('SO_TK', numTK);
    try {
      const result = await axios.post(
        'http://' + apiURL + ':8221/DToKhaiNopPhi/GetThongBaoNP_TaoBienLai/',
        data,
        {
          headers: {
            __RequestVerificationToken: verificationToken,
          },
          withCredentials: true,
        }
      );
      return result.data;
    } catch (err) {
      return undefined;
    }
  };

  const addTK = (soToKhai) => {
    // console.log('So TK: ' + soToKhai);
    getAndAdd(soToKhai);
  };

  const removeTK = (khaiNumber) => {
    // console.log('Removing TK ' + khaiNumber);
    const index = getIndex(khaiNumber);
    // console.log(index);
    const newList = [...listTK];
    newList.splice(index, 1);
    window.localStorage.setItem('danh_sach', JSON.stringify(newList));
    setList(newList);
  };

  /**
   * ! Getting Index of declaration
   */
  const getIndex = (khaiNumber) => {
    return listTK.map((element) => element.SO_TK_NOP_PHI).indexOf(khaiNumber);
  };

  /**
   * ! Loading batman running
   */
  const BatmanRun = ({ loadingStatus }) => {
    return (
      <>
        <span style={{ display: 'inline-block' }}>
          &nbsp;&nbsp;
          <img
            src={'chrome-extension://' + extensionID + '/brun.gif'}
            height="64"
            style={{
              display: loadingStatus === true ? 'inline-block' : 'none',
            }}
          />
        </span>
      </>
    );
  };

  /**
   * ! Visual for AddToKhai
   */
  const AddToKhai = () => {
    return (
      <>
        <div>
          <p />
          {/* <form onSubmit={addTK} style={{ display: 'inline-block' }}>
            <input
              onClick={() => setBill('')}
              onChange={numberChange}
              value={billNumber}
              autoFocus={true}
              maxLength="12"
              placeholder="Số tờ khai, thông báo nộp phí"
              className="item-search except form-control form-control-sm"
              style={{
                width: 270,
                display: 'inline-block',
                borderColor: '#54C6EB',
                background: 'white',
              }}
            />
            <span>&nbsp;&nbsp;</span>
            <button className="btn btn-primary btnSearch">
              <strong>+</strong> Thêm
            </button>
          </form> */}
          <span>
            <strong style={{ color: 'green' }}>
              Danh sách Tờ khai Hải quan đã xuất Biên lai
            </strong>
            &nbsp;&nbsp;
            <Button
              onClick={() => {
                setList([]);
                window.localStorage.removeItem('danh_sach');
              }}
            >
              <strong>⌦</strong> Xóa hết
            </Button>
          </span>
        </div>
      </>
    );
  };

  /**
   * ! Visual for each declaration number
   */
  const ListItem = ({ item }) => {
    // console.log('Item being displayed: ', item);
    //Case of type
    let type = '';
    switch (item.LOAI_TK_NP) {
      case '100':
        type = <span style={{ color: 'green' }}>Hàng container</span>;
        break;
      case '101':
        type = <span style={{ color: '#007A99' }}>Hàng lỏng, rời</span>;
        break;
      default:
        break;
    }

    //Case số biên lai
    let receiptNumber = (
      <a
        href="#"
        onClick={() =>
          window.open(
            'http://' +
              apiURL +
              ':8224/Viewer/HoaDonViewer.aspx?mhd=' +
              item.EINVOICE_LINK,
            'example',
            'width=1200,height=800'
          )
        }
        style={{ fontWeight: 'bold' }}
      >
        <span style={{ color: '#007A99' }}>{item.MA_TRAM_TP}</span>
        <span style={{ color: 'black' }}>&nbsp;-&nbsp;</span>
        <span style={{ color: '#FF6633' }}>
          {item.SO_BIEN_LAI.padStart(7, '0')}
        </span>
      </a>
    );

    //Row index
    const rowIndex = getIndex(item.SO_TK_NOP_PHI) + 1;

    return (
      <tr>
        <td className="text-center">
          <a
            href="#"
            onClick={() =>
              window.open(
                'http://' +
                  apiURL +
                  ':8221/cap-nhat-thong-tin-to-khai/' +
                  item.DTOKHAINPID,
                'example',
                'width=1200,height=800'
              )
            }
          >
            <em style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              Xem
            </em>
          </a>
        </td>
        {/* -----------------STT--------------------------- */}
        <td className="text-center">{rowIndex}</td>

        {/* -----------------SỐ TỜ KHAI NỘP PHÍ--------------------------- */}
        <td className="text-center">{item.SO_TK_NOP_PHI}</td>

        {/* ------------------LOẠI HÀNG-------------------------- */}
        <td className="text-center">{type}</td>

        {/* ------------------SỐ TỜ KHAI HẢI QUAN-------------------------- */}
        <td
          className="text-center"
          style={{ color: 'red', fontWeight: 'bold' }}
        >
          {item.SO_TKHQ}
        </td>

        {/* ----------------TÊN DOANH NGHIỆP---------------------------- */}
        <td
          className="text-left"
          style={{ fontWeight: 'normal', width: 'auto' }}
        >
          {item.MA_DV_KHAI_BAO + ' - ' + item.TEN_DN}
        </td>
        {/* ------------------NGÀY TỜ KHAI-------------------------- */}
        <td className="text-center">{item.NGAY_TK_HQ}</td>

        {/* -------------SỐ TIỀN------------------------------- */}
        <td
          className="text-right"
          style={{ color: '#dc2f02', fontWeight: 'bold' }}
        >
          {item.TONG_TIEN.toLocaleString('vi')}
        </td>

        {/* -------------HÌNH THỨC THANH TOÁN------------------------------- */}
        <td
          className="text-center"
          style={{ color: '#B146C2', fontWeight: 'bold' }}
        >
          {item.MA_LOAI_THANH_TOAN}
        </td>

        {/* ------------------SỐ BIÊN LAI-------------------------- */}
        <td className="text-center">{receiptNumber}</td>

        {/* ------------------Checkbox-------------------------- */}
        {/* <td className="text-center">
          <input type="checkbox" onClick={() => getSelected()} />
        </td> */}
        {/* ------------------TIME-------------------------- */}
        <td className="text-center">{item.TIME}</td>

        {/* ----------------XÓA TỜ KHAI---------------------------- */}
        <td
          className="text-center"
          onClick={() => removeTK(item.SO_TK_NOP_PHI)}
        >
          <a href="#" style={{ color: 'red' }}>
            <em>Xóa</em>
          </a>
        </td>
      </tr>
    );
  };

  /**
   * ! Function to get selected row values
   */
  const getSelected = () => {
    const grid = document.getElementById('dsTable');
    const checkboxes = grid.getElementsByTagName('input');

    //Loop through checkboxes
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        const selectedRow = checkboxes[i].parentNode.parentNode;

        printLine(selectedRow.cells[7].innerHTML);
      }
    }
  };

  /**
   * ! The declaration List visual
   */
  const ListDisplay = () => {
    let sortedList = [...listTK];
    sortedList.sort(
      (a, b) => getIndex(b.SO_TK_NOP_PHI) - getIndex(a.SO_TK_NOP_PHI)
    );
    // console.log(listTK, sortedList);
    return (
      <>
        <hr></hr>
        <div style={{ height: '400px', overflow: 'scroll' }}>
          <table id="dsTable" className="width100">
            <thead>
              <tr>
                <th className="width50px text-center">#</th>
                <th className="width50px text-center">STT</th>
                <th className="text-center">TK Nộp Phí</th>
                <th className="text-center">Loại hàng</th>
                <th className="text-center">TK hải quan</th>
                <th className="text-center">Doanh nghiệp</th>
                <th className="text-center">Ngày TK</th>
                <th className="text-center">Số tiền</th>
                <th className="text-center">Hình thức TT</th>
                <th className="text-center width100px">Biên lai</th>
                {/* <th className="text-center width100px">
                  <input type="checkbox" />
                </th> */}
                <th className="text-center width100px">Added at</th>
                <th className="text-center">Operation</th>
              </tr>
            </thead>
            <tbody>
              {/* ------------- TỔNG TIỀN CỦA TOÀN BỘ TỜ KHAI ĐÃ THÊM */}
              <tr className="bold">
                <td className="text-center bold" colSpan="7">
                  Tổng tiền của{' '}
                  <span style={{ color: 'red' }}>{listTK.length}</span> bộ là:
                </td>
                <td
                  className="text-right"
                  style={{
                    color: 'red',
                  }}
                >
                  {listTK.length > 0
                    ? listTK
                        .map((element) => element.TONG_TIEN)
                        .reduce((sum, current) => sum + current)
                        .toLocaleString('vi')
                    : 0}
                </td>
                <td className="text-center" colSpan="4">
                  Meow Meow
                </td>
              </tr>
              {/*-------------- DANH SÁCH TỜ KHAI ĐÃ THÊM------------ */}
              {sortedList.map((item, index) => (
                <ListItem key={index} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  /**
   * ! cap-nhat-thong-tin-bien-lai-dien-tu page
   */

  /**
   * ! Add issued BL to list
   */
  const addTK2 = () => {
    printLine('ADDTK2 CLICKED');
    const info = {
      TIME: new Date().toLocaleTimeString(),
      DTOKHAINPID: document.getElementsByName('DTOKHAINPID')[0].value || '',
      SO_TK_NOP_PHI: document.getElementById('SO_TK_NOP_PHI').value || '',
      SO_TKHQ: document.getElementsByName('SO_TK_HQ')[0].value || '',
      TEN_DN: document.getElementsByName('TEN_DV_KHAI_BAO')[0].value || '',
      MA_DV_KHAI_BAO: document.getElementById('MA_DV_KHAI_BAO').value || '',
      MA_LOAI_THANH_TOAN:
        document.getElementsByName('MA_LOAI_THANH_TOAN')[0].value || '',
      MA_TRAM_TP: document.getElementById('MA_TRAM_TP').value || '',
      NGAY_TK_HQ: document.getElementsByName('NGAY_TK_HQTMP')[0].value || '',
      LOAI_TK_NP: document.getElementsByName('LOAI_TK_NP')[0].value || '',
      TONG_TIEN:
        parseInt(
          document
            .getElementsByClassName('SHOW_TIEN_TEXT text-right bold')[0]
            .innerHTML.match(/[0-9]/g)
            .join('')
        ) || 0,
      EINVOICE_LINK:
        document.getElementsByName('LINK_VIEW_EINVOICE')[0].value || '',

      SO_BIEN_LAI: document.getElementsByName('SO_BIEN_LAI')[0].value || '',
    };

    // console.log('INfo is: ', info);
    let currentList =
      JSON.parse(window.localStorage.getItem('danh_sach')) !== null
        ? JSON.parse(window.localStorage.getItem('danh_sach'))
        : [];
    // console.log('CurrentList: ', currentList);

    window.localStorage.setItem(
      'danh_sach',
      JSON.stringify(currentList.concat(info))
    );
  };

  /**
   * ! Condition to issue BL
   */
  const checkCondition = () => {
    // id = DBIENLAI_TPID
    const id = document.URL.replace('8221', '').match(/[0-9]/g).join('');
    // console.log(id);
    const data = new FormData();
    const data2 = new FormData();

    let invoiceNum = null;
    data.append('DBIENLAITPID', id);
    data.append('hasIssuedInvoice', 0);
    data2.append('DBIENLAITPID', id);

    let eInvoiceLink = '';

    const billInfo = {
      TIME: new Date().toLocaleTimeString(),
      DTOKHAINPID: document.getElementsByName('DTOKHAINPID')[0].value || '',
      SO_TK_NOP_PHI: document.getElementById('SO_TK_NOP_PHI').value || '',
      SO_TKHQ: document.getElementsByName('SO_TK_HQ')[0].value || '',
      TEN_DN: document.getElementsByName('TEN_DV_KHAI_BAO')[0].value || '',
      MA_DV_KHAI_BAO: document.getElementById('MA_DV_KHAI_BAO').value || '',
      MA_LOAI_THANH_TOAN:
        document.getElementsByName('MA_LOAI_THANH_TOAN')[0].value || '',
      MA_TRAM_TP: document.getElementById('MA_TRAM_TP').value || '',
      NGAY_TK_HQ: document.getElementsByName('NGAY_TK_HQTMP')[0].value || '',
      LOAI_TK_NP: document.getElementsByName('LOAI_TK_NP')[0].value || '',
      TONG_TIEN:
        parseInt(
          document
            .getElementsByClassName('SHOW_TIEN_TEXT text-right bold')[0]
            .innerHTML.match(/[0-9]/g)
            .join('')
        ) || 0,
      EINVOICE_LINK:
        eInvoiceLink ||
        document.getElementsByName('LINK_VIEW_EINVOICE')[0].value,
      SO_BIEN_LAI:
        invoiceNum !== null
          ? invoiceNum
          : document.getElementsByName('SO_BIEN_LAI')[0].value,
    };

    console.log(billInfo);

    try {
      //Check condition first
      setLoading(true);

      axios
        .post(
          'http://' +
            apiURL +
            ':8221/DBienLaiThuPhi/CheckConditionIssuedInvoice/',
          data,
          {
            headers: {
              __RequestVerificationToken: verificationToken,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log(res.data.code);
          if (res.data.code === 1) {
            return axios
              .post(
                'http://' +
                  apiURL +
                  ':8221/DBienLaiThuPhi/CheckConditionIssuedInvoice/',
                data2,
                {
                  headers: {
                    __RequestVerificationToken: verificationToken,
                  },
                  withCredentials: true,
                }
              )
              .then((res) => {
                console.log(res.data);
                invoiceNum = res.data.EINVOICE_OUT.InvoiceNumber;
                eInvoiceLink = res.data.EINVOICE_OUT.InvoiceKey;
                console.log(invoiceNum, eInvoiceLink);
                setBL(invoiceNum);
                if (invoiceNum !== null) setLoading(false);
              });
          } else {
            alert(res.data.message);
            setLoading(false);
          }
        });
    } catch (error) {
      alert(error.message);
    }
    return invoiceNum;
  };

  const CapNhatPage = () => {
    try {
      //Check if ten nguoi nop phi is empty then auto add name
      const name = document.getElementsByClassName('form-control input-sm')[2]
        .value;
      if (name == '') {
        document.getElementsByClassName('form-control input-sm')[2].value =
          'không có tên';
      }

      const TKHQ = document.getElementsByClassName(
        'form-control input-sm bold'
      )[1].value;

      const money = parseInt(
        document
          .getElementsByClassName('SHOW_TIEN_TEXT text-right bold')[0]
          .innerHTML.match(/[0-9]/g)
          .join('')
      ).toLocaleString('vi');

      return (
        <span style={{ display: isURL }}>
          <p />
          <div style={{ borderTop: '1px solid #ccc' }}></div>
          <p />
          <span style={{ fontWeight: 'bold' }}>
            {/* ------------------------ */}
            <span>
              Số TK Hải quan: <span style={{ color: '#dc2f02' }}>{TKHQ}</span>
            </span>
            {/* ------------------------ */}
            <span> - </span>
            {/* ------------------------ */}
            <span>
              Số tiền:
              <span style={{ color: 'red' }}> {money}</span>
            </span>
            &nbsp;&nbsp;
            <span>
              <Button
                id="one-click"
                onClick={() => checkCondition()}
                style={{
                  visibility:
                    currentBL.length === 0 &&
                    document.getElementsByName('SO_BIEN_LAI')[0].value ===
                      '0000000'
                      ? ''
                      : 'hidden',
                }}
              >
                1-Click BL
              </Button>
            </span>
            <span>
              <BatmanRun loadingStatus={loading} />
            </span>
            <span
              style={{
                display: currentBL.length === 0 ? 'none' : '',
              }}
            >
              Số biên lai: <span style={{ color: '#ff6603' }}>{currentBL}</span>
            </span>
            <span style={{ color: 'white', fontWeight: 'normal' }}>
              <StyledA onClick={() => addTK2()} id="testButton">
                Test2
              </StyledA>
            </span>
          </span>
        </span>
      );
    } catch {
      return <></>;
    }
  };

  /**
   * ! Main Components
   */

  return (
    <>
      <div style={{ display: correctURL }}>
        <div
          style={{
            display: 'block',
            minHeight: '40vh',
            border: '1px solid #ccc',
            margin: '1em 0',
            borderRadius: '2px',
            padding: '5px',
          }}
        >
          <strong>Thu phí Extension - </strong>
          <strong style={{ color: 'red' }}>BETA</strong>
          <AddToKhai />
          <ListDisplay />
        </div>
      </div>
      <CapNhatPage />
    </>
  );
};

//Render the element to Content page
const app = document.createElement('div');
cardBody.appendChild(app);
capnhatBody !== undefined ? capnhatBody.appendChild(app) : '';

ReactDOM.render(<ContentReact />, app);
