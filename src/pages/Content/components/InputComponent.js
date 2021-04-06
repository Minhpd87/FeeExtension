/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

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
          style={{ display: loading ? '' : 'none', height: '48px' }}
        />
        <a
          href=""
          className={loading ? 'btn-disabled' : 'btn-add'}
          onClick={test}
        >
          <i className="fa fa-refresh" aria-hidden="true"></i> Refresh info
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
        <input
          type="checkbox"
          id="noBL"
          disabled={false}
          onChange={(event) => filterList(event)}
          style={{ marginLeft: '5px' }}
        />
        <span> Lọc chưa có BL </span>
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
