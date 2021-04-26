/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

const verificationToken = document.querySelector(
  '[name=__RequestVerificationToken]'
).value;

function downloadObjectAsJson(exportObj, exportName) {
  var dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

const getAllData = () => {
  event.preventDefault();
  const target = '/BAOCAO_BANGKEBIENLAI/Get_BangKeBienLai_1/';

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  let allResult = [];
  let errorList = [];

  let endDate = new Date(Date.parse('12/31/2020'));

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const getAllInfo = async (i) => {
    let data = new FormData();
    let startDate = new Date(Date.parse(i));
    let nextDay = new Date();
    nextDay = startDate.addDays(0);

    if (nextDay > endDate) nextDay = endDate;

    // console.log(startDate, nextDay);

    console.log(
      `From ${startDate.toLocaleDateString(
        'en-GB'
      )} to ${nextDay.toLocaleDateString('en-GB')}`
    );
    data.append('LOAINGAY', '0');
    data.append('TU_NGAY', startDate.toLocaleDateString('en-GB'));
    data.append('DEN_NGAY', nextDay.toLocaleDateString('en-GB'));
    data.append('MA_TRAM_TP', '');
    data.append('HINH_THUC_THANH_TOAN', '');
    data.append('TEN_NGUOI_THU', '');
    data.append('MA_DN', '');
    data.append('MA_CHOT', '');
    try {
      const response = await fetch(target, {
        method: 'POST',
        body: data,
        headers: {
          __RequestVerificationToken: verificationToken,
        },
        credentials: 'same-origin',
      });

      let localResult = await response.json();

      if (localResult.DS_BIENLAITHU.length > 0) {
        // console.log(localResult.DANHSACH);
        allResult = allResult.concat(
          localResult.DS_BIENLAITHU.map((e) => e.TONG_TIEN)
        );
        console.log(allResult);
      } else {
        console.log(`Error at ${i}`);
        errorList = errorList.concat(i);
      }

      if (nextDay < endDate) {
        getAllInfo(nextDay.addDays(1));
      } else {
        downloadObjectAsJson(allResult, 'Thang-');
        return;
      }
    } catch (error) {
      console.log(`Error fetching ${error.message}`);
    }
  };

  getAllInfo('01/01/2020');

  return allResult;
};

const InputComponent = (props) => {
  const {
    submit,
    change,
    value,
    click,
    loading,
    click2,
    test,
    readXLS,
    filterList,
    setCurrentStart,
    setCurrentEnd,
    currentEnd,
    currentStart,
    list247,
  } = props;
  const extensionID = chrome.runtime.id;
  const [selectedFile, setSelectedFile] = useState('');

  document.getElementById('upload')?.addEventListener('change', (event) => {
    let currentFile = event.target.files[0];
    setSelectedFile(currentFile);
    // console.log(currentFile);
  });

  const changeIndex = (event) => {
    let id = event.target.id;
    // console.log(event.target.value);
    let value = parseInt(event.target.value) || '';
    if (id === 'startBL') {
      setCurrentStart(value);
    }
    if (id === 'endBL') {
      setCurrentEnd(value);
    }
  };

  return (
    <div className="input-container">
      <div>
        <span>Mã vạch: </span>
        <form onSubmit={submit} style={{ display: 'inline-block' }}>
          <input
            onChange={change}
            value={value}
            maxLength="12"
            placeholder="Số tờ khai, thông báo nộp phí"
            className="input-primary"
            id="inputTK"
            // type="number"
            // max="999999999999"
            autoFocus={true}
            autoComplete="off"
          />
          <span>&nbsp;&nbsp;</span>
          <a className="btn-add" href="#" onClick={click}>
            <i className="fa fa-search-plus"></i> Tìm và Thêm
          </a>
        </form>
        <a className="btn-delete" href="#" onClick={click2} id="delete-button">
          <i className="fa fa-trash" aria-hidden="true"></i> Xoá hết
        </a>
        <img
          src={'chrome-extension://' + extensionID + '/7.gif'}
          alt="search-loading"
          id="searchLoad"
          style={{ display: loading ? '' : 'none', height: '48px' }}
        />
        <a
          href=""
          className={loading ? 'btn-disabled' : 'btn-add'}
          onClick={test}
        >
          <i className="fa fa-refresh" aria-hidden="true"></i> Refresh info
        </a>
        <a href="" className="btn-add" onClick={getAllData}>
          <i className="fa fa-refresh" aria-hidden="true"></i> Lấy dữ liệu
        </a>
      </div>
      {/* EXCEL FILES */}
      <div>
        <hr />
        <span className="bold">
          <span className="red">File: </span>
          <em>{selectedFile ? selectedFile.name : 'Chưa chọn file nào...'} </em>
        </span>
        <input
          type="file"
          id="upload"
          style={{ display: 'none' }}
          accept=".xls, .xlsx"
        />
        <label
          className="btn-orange"
          htmlFor="upload"
          style={{ width: '75px' }}
        >
          Browse
        </label>
        <a
          href="#"
          className={loading ? 'btn-disabled' : 'btn-add'}
          onClick={() => readXLS(selectedFile)}
        >
          Đọc file
        </a>
        <span>&nbsp;</span>
        <input
          className="input-free"
          style={{ width: '75px' }}
          placeholder="Từ số ..."
          type="number"
          value={currentStart}
          id="startBL"
          min="1"
          onChange={(event) => changeIndex(event)}
        />
        <span>&nbsp;đến số&nbsp;</span>
        <input
          className="input-free"
          style={{ width: '75px' }}
          placeholder="Đến số ..."
          value={currentEnd}
          type="number"
          id="endBL"
          min="1"
          onChange={(event) => changeIndex(event)}
        />
        {/* <span className="bold">
          <em>&nbsp;(mặc định sẽ đọc 50 số Tờ khai 1 lần)</em>
        </span> */}
        <a
          onChange={(event) => filterList(event)}
          className="btn-add"
          href="#"
          style={{ marginLeft: '5px' }}
        >
          Lọc chưa có BL
        </a>
        <span>&nbsp;</span>
        <span
          className="bold"
          style={{
            border: '1px solid #ccc',
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          Đã đọc <span style={{ color: 'red' }}>{list247.length}</span> bộ
        </span>
      </div>
    </div>
  );
};

export default InputComponent;
