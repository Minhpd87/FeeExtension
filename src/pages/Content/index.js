import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { printLine } from './modules/print';

console.log('Thu Phi Extension Loaded!');
console.log('Must reload extension for modifications to take effect.');

// printLine("Using the 'printLine' function from the Print Module");

//URL for sending request
const apiURL = window.location.hostname;

//Correct URL for displaying the extension
const correctURL = document.URL.includes('tim-kiem-to-khai-nop-phi')
  ? 'block'
  : 'none';

const cardBody = document.getElementsByClassName('card-body')[0];

// Main Extension Content

axios.defaults.withCredentials = true;

const verificationToken = document.querySelector(
  '[name=__RequestVerificationToken]'
).value;

//Test get info
// getInfo(303749648440);

// Components
const ContentReact = () => {
  const [billNumber, setBill] = useState('');
  const [listTK, setList] = useState([]);

  //Function to add ToKhai to List
  //---Handle bill number on change
  const numberChange = (event) => {
    setBill(event.target.value);
  };

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

    //Getting info
    //convert soToKhai to form-data for sending POST request
    const data = new FormData();
    data.append('SO_TK', soToKhai);
    try {
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
      setList(listTK.concat(response.data.DANHSACH));
      //   console.log(listTK);
    } catch {}
  };

  const addTK = (event) => {
    event.preventDefault();
    console.log('So TK: ' + billNumber);
    getAndAdd(billNumber);
  };

  const removeTK = (khaiNumber) => {
    console.log('Removing TK ' + khaiNumber);
    const index = getIndex(khaiNumber);
    console.log(index);
    const newList = [...listTK];
    newList.splice(index, 1);
    setList(newList);
  };

  //Get Tokhai Index
  const getIndex = (khaiNumber) => {
    return listTK.map((element) => element.DTOKHAINPID).indexOf(khaiNumber);
  };

  //Add To Khai component Visual
  const AddToKhai = () => {
    return (
      <>
        <div>
          <p />
          <form onSubmit={addTK} style={{ display: 'inline-block' }}>
            <input
              onClick={() => setBill('')}
              onChange={numberChange}
              value={billNumber}
              autoFocus={true}
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
          </form>
          <span>
            &nbsp;&nbsp;
            <button
              style={{
                backgroundColor: '#FF6633',
                border: '1px solid transparent',
                borderRadius: '2px',
                color: 'white',
                padding: '4px 12px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              onClick={() => setList([])}
            >
              <strong>⌦</strong> Xóa hết
            </button>
          </span>
        </div>
      </>
    );
  };

  //Visual for List To Khai
  const ListItem = ({ item }) => {
    // console.log(item);
    console.log(
      listTK.map((element) => element.TONG_TIEN).reduce((a, b) => a + b)
    );

    //Case of status
    let status = '';
    switch (item.TRANG_THAI) {
      case 1:
        status = (
          <span
            style={{
              color: '#007A99',
              fontWeight: 'normal',
              textAlign: 'left',
            }}
          >
            Code 1 - Đã khai báo
          </span>
        );
        break;
      case 2:
        status = (
          <span
            style={{
              color: '#007A99',
              fontWeight: 'normal',
              textAlign: 'left',
            }}
          >
            Code 2 - To be read
          </span>
        );
        break;
      case 3:
        status = (
          <span
            style={{
              color: '#007A99',
              fontWeight: 'normal',
              textAlign: 'left',
            }}
          >
            Code 3 - To be read
          </span>
        );
        break;
      case 4:
        status = (
          <span
            style={{
              color: '#007A99',
              fontWeight: 'normal',
              textAlign: 'left',
            }}
          >
            Code 4 - To be read
          </span>
        );
        break;
      default:
        status = item.TRANG_THAI;
        break;
    }

    //Case of type
    let type = '';
    switch (item.LOAI_TK_NP) {
      case 100:
        type = <span style={{ color: 'green' }}>Hàng container</span>;
        break;
      case 101:
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
        <span style={{ color: '#007A99' }}>{item.MA_TRAM_TP}</span>,
        <span style={{ color: '#FF6633' }}>{item.SO_BIEN_LAI}</span>
      </a>
    );

    //Case Xuất BL Button
    let blButton =
      item.HAS_BIENLAI !== true ? (
        <button
          className="btn btn-success btnPhatHanhBienLaiTheoLo"
          title="Click để phát hành thông báo"
          style={{ width: 'auto', marginRight: '5px' }}
        >
          <i className="fa fa-paper-plane-o"></i>&nbsp;Xuất BL
        </button>
      ) : (
        receiptNumber
      );

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
        {/* -------------------------------------------- */}
        <td className="text-center">{item.SO_TK_NOP_PHI}</td>
        {/* -------------------------------------------- */}
        <td className="text-center">{type}</td>
        {/* -------------------------------------------- */}
        <td
          className="text-center"
          style={{ color: 'red', fontWeight: 'bold' }}
        >
          {item.SO_TKHQ}
        </td>
        {/* -------------------------------------------- */}
        <td
          className="text-left"
          style={{ fontWeight: 'normal', width: 'auto' }}
        >
          {item.MA_DV_KHAI_BAO + ' - ' + item.TEN_DN}
        </td>
        {/* -------------------------------------------- */}
        <td className="text-center">{status}</td>
        {/* -------------------------------------------- */}
        <td className="text-right" style={{ color: 'red', fontWeight: 'bold' }}>
          {item.TONG_TIEN.toLocaleString('vi')}
        </td>
        {/* -------------------------------------------- */}
        <td className="text-center">
          <button
            title=""
            className="btn btn-primary btnSearch"
            onClick={() =>
              window.open(
                'http://' +
                  apiURL +
                  ':8221/in-thong-bao-nop-phi/' +
                  item.DTOKHAINPID,
                'example',
                'width=1200,height=800'
              )
            }
            style={{ textAlign: 'center' }}
          >
            In TB
          </button>
        </td>
        {/* -------------------------------------------- */}
        <td className="text-center">{blButton}</td>
        {/* -------------------------------------------- */}
        <td className="text-center" onClick={() => removeTK(item.DTOKHAINPID)}>
          <a href="#" style={{ color: 'red' }}>
            <em>Xóa TK</em>
          </a>
        </td>
      </tr>
    );
  };

  const ListDisplay = () => {
    return (
      <>
        <hr></hr>
        <div>
          <strong>Danh sách Tờ khai Hải quan đã thêm</strong>
          <table id="" className="width100">
            <thead>
              <tr>
                <th className="width50px text-center">#</th>
                <th className="text-center">TK Nộp Phí</th>
                <th className="text-center">Loại hàng</th>
                <th className="text-center">TK hải quan</th>
                <th className="text-center">Doanh nghiệp</th>
                <th className="text-center">Status</th>
                <th className="text-center">Số tiền</th>
                <th className="text-center width100px">TB nộp phí</th>
                <th className="text-center width100px">Biên lai</th>
                <th className="text-center">Operation</th>
              </tr>
            </thead>
            <tbody>
              {listTK.map((item, index) => (
                <ListItem key={index} item={item} />
              ))}
              <tr className="bold">
                <td className="text-center bold" colSpan="6">
                  Tổng tiền của{' '}
                  <span style={{ color: 'red' }}>{listTK.length}</span> bộ là:
                </td>
                <td className="text-right">
                  {listTK.length > 0
                    ? listTK
                        .map((element) => element.TONG_TIEN)
                        .reduce((sum, current) => sum + current)
                        .toLocaleString('vi')
                    : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  };

  //Main Content
  return (
    <div style={{ display: correctURL }}>
      <div
        style={{
          display: 'block',
          minHeight: '40vh',
          // border: '0',
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
  );
};

//Render the element to Content page
const app = document.createElement('div');
cardBody.appendChild(app);
ReactDOM.render(<ContentReact />, app);
