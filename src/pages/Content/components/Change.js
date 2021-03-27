/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

/**
 * ! Tính tiền thừa:
 */
const Change = () => {
  /**
   * ! Money change
   */
  let totalAmount = 0;
  let change = 0;
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
      <div className="grid-row" style={{ width: '50vw' }}>
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
