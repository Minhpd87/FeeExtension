/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
const uniqueRandomArray = require('unique-random-array');
const random = uniqueRandomArray([
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
]);

let imgIndex = [random(), random(), random()];

/**
 * ! Tính tiền thừa:
 */
const Change = () => {
  /**
   * ! Money change
   */
  let totalAmount = 0;
  let change = 0;
  const extensionID = chrome.runtime.id;

  const [money, setMoney] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    1000,
    2000,
    5000,
    10000,
    20000,
    50000,
    100000,
    200000,
    500000,
  ]);

  for (let i = 0; i < 9; i++) {
    totalAmount = totalAmount + money[i] * money[i + 9];
  }

  const currentMoney =
    document.getElementById('total_debt') !== null
      ? parseInt(
          document.getElementById('total_debt').innerHTML.replaceAll('.', '')
        )
      : 0;

  // console.log(totalAmount, currentMoney, change);

  change = totalAmount - currentMoney;

  /**
   * ! Handle Change
   */
  const update = (index, new_value) => {
    const data = [...money];
    data[index] = new_value;
    return data;
  };

  const resetChange = () => {
    setMoney([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      1000,
      2000,
      5000,
      10000,
      20000,
      50000,
      100000,
      200000,
      500000,
    ]);
    imgIndex = [random(), random(), random()];
  };

  const noteChange = (e) => {
    const id = e.target.id;
    const value = parseInt(e.target.value) || '';

    switch (id) {
      case '1k':
        setMoney(update(0, value));
        break;
      case '2k':
        setMoney(update(1, value));
        break;
      case '5k':
        setMoney(update(2, value));
        break;
      case '10k':
        setMoney(update(3, value));
        break;
      case '20k':
        setMoney(update(4, value));
        break;
      case '50k':
        setMoney(update(5, value));
        break;
      case '100k':
        setMoney(update(6, value));
        break;
      case '200k':
        setMoney(update(7, value));
        break;
      case '500k':
        setMoney(update(8, value));
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid-row">
      <div className="grid-row" style={{ width: '45vw' }}>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="1k"
            value={money[0]}
          />
          {' x 1.000đ'}
        </span>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="2k"
            value={money[1]}
          />
          {' x 2.000đ'}
        </span>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="5k"
            value={money[2]}
          />
          {' x 5.000đ'}
        </span>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="10k"
            value={money[3]}
          />
          {' x 10.000đ'}
        </span>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="20k"
            value={money[4]}
          />
          {' x 20.000đ'}
        </span>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="50k"
            value={money[5]}
          />
          {' x 50.000đ'}
        </span>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="100k"
            value={money[6]}
          />
          {' x 100.000đ'}
        </span>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="200k"
            value={money[7]}
          />
          {' x 200.000đ'}
        </span>
        <span className="item">
          <input
            className="input-sub"
            onChange={(e) => noteChange(e)}
            id="500k"
            value={money[8]}
          />
          {' x 500.000đ'}
        </span>
        <span className="item">
          <label
            className="btn-delete"
            id="cls-change"
            onClick={() => resetChange()}
          >
            Clear
          </label>
        </span>
      </div>
      <div
        className="column"
        style={{
          // overflow: 'scroll',
          borderRadius: '5px',
          scrollBehavior: 'smooth',
          // background: '#eee',
          marginBottom: '7px',
        }}
        id="batmanIMG"
      >
        <div
          style={{
            borderRadius: '5px',
            scrollBehavior: 'smooth',
            background: '#ccc',
            padding: '0 5px 0 5px',
            margin: 'auto',
            display: 'flex',
          }}
        >
          <img
            src={`chrome-extension://${extensionID}/${imgIndex[0]}.gif`}
            alt={`Batman-loading-gif`}
            style={{
              height: '88px',
              borderRadius: '5px',
              display: 'block',
              margin: '5px 5px 5px auto',
            }}
          />
          <img
            src={`chrome-extension://${extensionID}/${imgIndex[1]}.gif`}
            alt={`Batman-loading-gif`}
            style={{
              height: '88px',
              borderRadius: '5px',
              display: 'block',
              margin: '5px 5px 5px auto',
            }}
          />
          <img
            src={`chrome-extension://${extensionID}/${imgIndex[2]}.gif`}
            alt={`Batman-loading-gif`}
            style={{
              height: '88px',
              borderRadius: '5px',
              display: 'block',
              margin: '5px auto 5px auto',
            }}
          />
        </div>
      </div>
      <div className="column">
        <span
          style={{ fontWeight: 'bold', marginLeft: 'auto', textAlign: 'right' }}
        >
          <span>
            Tổng tiền
            nhận:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span id="received" style={{ color: '#008B8B' }}>
            {totalAmount.toLocaleString('vi')} đồng
          </span>
          <div style={{ borderBottom: '1px solid #ccc' }}>
            - Phải
            thu:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{ color: '#800080' }}>
              {' '}
              {document.getElementById('total_debt') !== null
                ? document.getElementById('total_debt').innerHTML
                : 0}{' '}
              đồng
            </span>
          </div>
          <div>
            = Trả lại:
            <span style={{ color: '#FF4500' }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {change.toLocaleString('vi')} đồng
            </span>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Change;
