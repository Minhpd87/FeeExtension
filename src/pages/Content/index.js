import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import LogRocket from 'logrocket';
// import setupLogRocketReact from 'logrocket-react';

// React Alert
import { transitions, positions, Provider as AlertProvider } from 'react-alert';

import { printLine } from './modules/print';
// import { decodedTextSpanIntersectsWith } from 'typescript';

import styled from 'styled-components';
import './content.styles.css';

// Component Import
import BarcodeComponent from './components/BarCodeComponent';

console.log('Thu Phi Extension Loaded!');

/**
 * ! React Alert options
 */
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

/**
 * ! Alert Template
 */
const AlertTemplate = ({ options, message, close }) => {
  const style = {
    fontWeight: 'normal',
    border: '1px solid #ccc',
    padding: '15px 15px',
    marginBottom: '30px',
    fontFamily: 'Arial',
    fontSize: '1rem',
    borderRadius: '5px',
    color: 'white',
    background: 'black',
    // textAlign: 'center',
    boxShadow: '1px 1px 5px #ccc',
  };
  return (
    <div style={style}>
      {options.type === 'info' && (
        <i className="fa fa-info-circle fa-lg color-blue"></i>
      )}
      {options.type === 'success' && (
        <i className="fa fa-check-circle fa-lg color-green"></i>
      )}
      {options.type === 'error' && <i className="fa fa-times fa-lg red"></i>}{' '}
      &nbsp;
      {message}
    </div>
  );
};

/**
 * ! Styled component
 */

const Button = styled.button`
  background: #006a99;
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

    //Ctrl + B
    if (e.ctrlKey && e.keyCode == 66) {
      //Click the element Ctrl + B
      let today = new Date().toDateString().toLocaleString('vi');
      console.log(today);
      window.localStorage.setItem('ActiveOn', today);

      let currentStatus = window.localStorage.getItem('KichHoat');
      if (currentStatus !== 'true')
        window.localStorage.setItem('KichHoat', 'true');
      if (currentStatus === 'true')
        window.localStorage.setItem('KichHoat', 'false');
      //Reload the page
      window.location.href = '/tim-kiem-to-khai-nop-phi';
    }

    //Button ]
    if ((e.ctrlKey && e.keyCode === 221) || e.keyCode === 221) {
      if (
        document.getElementsByClassName('form-control input-sm')[13].value ===
        'CK'
      ) {
        alert(`Hình thức thanh toán là Chuyển khoản a a a á!`);
      }
      console.log('Lưu lại clicked');
      document
        .getElementsByClassName('btn btn-primary mr10px btn-padding')[0]
        .click();
    }

    //Button /
    if (e.keyCode === 191) {
      document.getElementById('delete-button').click();
      document.getElementById('inputTK').focus();
      console.log('Delete everthing');
    }

    //Ctrl + \
    if ((e.ctrlKey && e.keyCode == 220) || e.keyCode == 220) {
      let upper = document.getElementsByName('SO_TK')[0];
      let lower = document.getElementById('inputTK');
      document.getElementById('inputTK').value = '';
      if (upper.value.length < 12) {
        upper.value = '';
      }

      if (document.activeElement === upper) {
        lower.focus();
      } else if (document.activeElement === lower) {
        upper.focus();
      } else {
        lower.focus();
      }
    }

    // Button =
    if (e.keyCode == 187) {
      let a = document.getElementById('issue-btn-0');
      let b = document.getElementById('one-click');
      if (a !== null) {
        a.click();
        console.log('One-click1 clicked');
      }
      if (b !== null) {
        b.click();
        console.log('One-click clicked');
      }
    }

    //' Button
    if (e.keyCode === 222) {
      window.location.href =
        window.location.origin + '/tim-kiem-to-khai-nop-phi';
    }
  } catch (error) {
    console.log('Có lỗi xảy ra: ' + error.message);
    document.getElementById('inputTK').value = '';
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
  const [loading, setLoading] = useState(false);
  const [currentBL, setBL] = useState('');
  //LogRocket
  // LogRocket.init('a2wjeh/feeextension');
  // setupLogRocketReact(LogRocket);
  /**
   * ! Load current List from Local Storage
   */
  useEffect(() => {
    // console.log('effect');

    //check if ActiveOn Today
    const today = new Date().toDateString().toLocaleString('vi');
    if (today !== window.localStorage.getItem('ActiveOn')) {
      console.log('Today does not match');
      window.localStorage.setItem('KichHoat', 'false');
      window.localStorage.setItem('full_list', JSON.stringify([]));
    } else {
      console.log('Match ActiveOn');
    }
  }, []);

  /**
   * ! Loading batman running
   */
  const BatmanRun = ({ loadingStatus }) => {
    return (
      <>
        <span style={{ display: 'inline-block' }}>
          &nbsp;&nbsp;
          <img
            alt="Batman Running"
            src={`chrome-extension://${extensionID}/${Math.floor(
              Math.random() * 19 + 1
            )}.gif`}
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
   * ! cap-nhat-thong-tin-bien-lai-dien-tu page
   */

  /**
   * ! Condition to issue BL
   */
  const checkCondition = () => {
    // id = DBIENLAI_TPID
    const id = document.URL.replace('8221', '')
      .match(/[0-9]/g)
      .join('')
      .replace('10101020', '');
    // console.log(id);
    const data = new FormData();
    const data2 = new FormData();

    let invoiceNum = null;
    data.append('DBIENLAITPID', id);
    data.append('hasIssuedInvoice', 0);
    data2.append('DBIENLAITPID', id);

    let eInvoiceLink = '';

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
                if (invoiceNum !== null) {
                  setLoading(false);
                  const billInfo = {
                    TIME: new Date().toLocaleTimeString(),
                    DTOKHAINPID:
                      document.getElementsByName('DTOKHAINPID')[0].value || '',
                    SO_TK_NOP_PHI:
                      document.getElementById('SO_TK_NOP_PHI').value || '',
                    SO_TKHQ:
                      document.getElementsByName('SO_TK_HQ')[0].value || '',
                    TEN_DN:
                      document.getElementsByName('TEN_DV_KHAI_BAO')[0].value ||
                      '',
                    MA_DV_KHAI_BAO:
                      document.getElementById('MA_DV_KHAI_BAO').value || '',
                    MA_LOAI_THANH_TOAN:
                      document.getElementsByName('MA_LOAI_THANH_TOAN')[0]
                        .value || '',
                    MA_TRAM_TP:
                      document.getElementById('MA_TRAM_TP').value || '',
                    NGAY_TK_HQ:
                      document.getElementsByName('NGAY_TK_HQTMP')[0].value ||
                      '',
                    LOAI_TK_NP:
                      document.getElementsByName('LOAI_TK_NP')[0].value || '',
                    TONG_TIEN:
                      parseInt(
                        document
                          .getElementsByClassName(
                            'SHOW_TIEN_TEXT text-right bold'
                          )[0]
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
                    TRANG_THAI: 1,
                    TRANG_THAI_BL: 1,
                    HAS_BIENLAI: true,
                  };

                  console.log(billInfo);
                  let currentList =
                    JSON.parse(window.localStorage.getItem('danh_sach_tk')) !==
                    null
                      ? JSON.parse(window.localStorage.getItem('danh_sach_tk'))
                      : [];
                  // console.log('CurrentList: ', currentList);

                  window.localStorage.setItem(
                    'danh_sach_tk',
                    JSON.stringify(currentList.concat(billInfo))
                  );
                }
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

      const TEN_DN = document.getElementsByName('TEN_DV_KHAI_BAO')[0].value;

      return (
        <span style={{ display: isURL }}>
          <p />
          <div style={{ borderTop: '1px solid #ccc' }}></div>
          <p />
          <span style={{ fontWeight: 'bold' }}>
            {/* ------------------------ */}
            <span>
              Doanh nghiệp: <span style={{ color: 'red' }}>{TEN_DN} - </span>
            </span>
            {/* ------------------------ */}
            <span>
              Số TK Hải quan: <span style={{ color: 'red' }}>{TKHQ}</span>
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
                  display: loading === false ? '' : 'none',
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
              Số biên lai: <span style={{ color: 'red' }}>{currentBL}</span>
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
    <AlertProvider template={AlertTemplate} {...options}>
      <div
        style={{
          display:
            window.localStorage.getItem('KichHoat') === 'true' ? '' : 'none',
        }}
      >
        <div style={{ display: correctURL }}>
          <div
            style={{
              display: 'block',
              minHeight: '100vh',
              // border: '1px solid #ccc',
              // margin: '1em 0',
              // borderRadius: '2px',
              // padding: '5px',
            }}
          >
            <strong>Thu phí Extension - </strong>
            <strong style={{ color: 'red' }}>BETA</strong>
            <span
              style={{
                float: 'right',
                fontWeight: 'bold',
              }}
            >
              <span style={{ color: 'blue' }}>Shorcut: </span>
              <span className="red 48px">/</span> : Xoá danh sách tờ khai;{' '}
              <span className="red">'</span> : Refresh page;{' '}
              <span className="red">=</span> : Phát hành biên lai vừa thêm;
              <span className="red">\</span> : Switch chít focus
            </span>
            <BarcodeComponent />
            <div>
              <p className="bold red" style={{ margin: '10px' }}>
                Notice:
              </p>
              <li>
                Sau khi click xóa hết, các tờ khai trong danh sách vừa xóa sẽ
                được thêm vào List tờ khai. Để danh sách tờ khai được đủ thì hãy
                xóa hết after each lần thu.
              </li>
              <li>List tờ khai tự động xóa khi sang ngày mới.</li>
              <li>
                Danh sách tờ khai as is at thời điểm lúc phát hành --> nếu tự bị
                nhảy BL hay mất BL thì sẽ do hệ thống.
              </li>
            </div>
          </div>
        </div>
        <CapNhatPage />
      </div>
    </AlertProvider>
  );
};

//Render the element to Content page
const app = document.createElement('div');
cardBody.appendChild(app);
capnhatBody !== undefined ? capnhatBody.appendChild(app) : null;

ReactDOM.render(<ContentReact />, app);
