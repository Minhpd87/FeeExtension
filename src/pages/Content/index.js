import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { printLine } from './modules/print';

console.log('Thu Phi Extension Loaded!');
console.log('Must reload extension for modifications to take effect.');

// printLine("Using the 'printLine' function from the Print Module");

console.log(document.URL);

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
      console.log(addedList);
      if (addedList.includes(soToKhai)) {
        alert('Tờ khai đã được thêm!');
        return;
      }
    } catch {}

    //Getting info
    //convert soToKhai to formdata for sending POST request
    const data = new FormData();
    data.append('SO_TK', soToKhai);
    try {
      const response = await axios.post(
        'http://thuphi.haiphong.gov.vn:8221/DToKhaiNopPhi/GetThongBaoNP_TaoBienLai/',
        data,
        {
          headers: {
            __RequestVerificationToken: verificationToken,
          },
          withCredentials: true,
        }
      );
      setList(listTK.concat(response.data.DANHSACH[0]));
      //   console.log(listTK);
    } catch {}
  };

  const addTK = (event) => {
    event.preventDefault();
    console.log('So TK: ' + billNumber);
    getAndAdd(billNumber);
  };

  //Add To Khai component Visual
  const AddToKhai = () => {
    return (
      <>
        <div>
          <p />
          <form onSubmit={addTK}>
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
    let status =
      item.HAS_BIENLAI === true ? (
        <span style={{ color: '#28a745' }}>Có Biên lai</span>
      ) : (
        <span style={{ color: '#007A99' }}>Chưa có Biên lai</span>
      );

    //Case of type
    let type = '';
    switch (item.LOAI_TK_NP) {
      case 100:
        type = <span style={{ color: '#28a745' }}>Hàng container</span>;
        break;
      case 101:
        type = <span style={{ color: '#007A99' }}>Hàng lỏng, rời</span>;
        break;
      default:
        break;
    }

    return (
      <tr>
        <td className="text-center">
          <a
            href={
              'http://thuphi.haiphong.gov.vn:8221/cap-nhat-thong-tin-to-khai/' +
              item.DTOKHAINPID
            }
          >
            Xem
          </a>
        </td>
        <td className="text-center">{item.SO_TK_NOP_PHI}</td>
        <td className="text-center">{type}</td>
        <td
          className="text-center"
          style={{ color: 'red', fontWeight: 'bold' }}
        >
          {item.SO_TKHQ}
        </td>
        <td className="text-left">
          {item.MA_DV_KHAI_BAO + ' - ' + item.TEN_DN}
        </td>
        <td className="text-center">{status}</td>
        <td className="text-right" style={{ color: 'red', fontWeight: 'bold' }}>
          {item.TONG_TIEN.toLocaleString('vi')}
        </td>
        <td>
          <button
            title=""
            class="btn btn-primary btnSearch width100px"
            onClick={() =>
              window.open(
                'http://thuphi.haiphong.gov.vn:8221/in-thong-bao-nop-phi/' +
                  item.DTOKHAINPID,
                'example',
                'width=1200,height=800'
              )
            }
          >
            In Thông báo
          </button>
        </td>
        {/* <td>{item.index}</td> */}
        {/* <td>{item.index}</td> */}
        {/* <td>{item.index}</td> */}
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
                <th className="text-center">Loại hình</th>
                <th className="text-center">TK hải quan</th>
                <th className="text-center">Doanh nghiệp</th>
                <th className="text-center">Status</th>
                <th className="text-center">Số tiền</th>
                <th className="text-center width100px">TB nộp phí</th>
                <th className="text-center width100px">Biên lai</th>
                <th className="width50px text-center">
                  <input type="checkbox" name="CHECKBOX_ALL" />
                </th>
              </tr>
            </thead>
            <tbody>
              {listTK.map((item, index) => (
                <ListItem key={index} item={item} />
              ))}
              <tr className="bold">
                <td className="text-center bold" colSpan="6">
                  Tổng tiền của {listTK.length} bộ là:
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
    <>
      <div>
        <strong>Thu phí Extension - </strong>
        <strong style={{ color: 'red' }}>BETA</strong>
        <AddToKhai />
        <ListDisplay />
      </div>
    </>
  );
};

//Render the element to Content page
const app = document.createElement('div');
cardBody.appendChild(app);
ReactDOM.render(<ContentReact />, app);
