/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import ItemComponent from './ItemComponent';

const ListComponent = (props) => {
  let {
    listTK,
    removeHandler,
    issueHandler,
    loadingStatus,
    getInfo,
    issueStatus,
    multiIssue,
  } = props;
  // const extensionID = chrome.runtime.id;
  let sortedList = [...listTK];

  sortedList.reverse();

  const TotalMoney = () => {
    return (
      <div style={{ float: 'right' }}>
        <a
          href="#"
          className={
            loadingStatus.includes(true) ? 'btn-disabled' : 'btn-issue'
          }
          style={{ marginRight: '5px', display: '' }}
          onClick={multiIssue}
        >
          <i className="fa fa-paper-plane-o"></i> Phát hành all
        </a>
        <span className="text-center bold">
          Tổng tiền của <span style={{ color: 'red' }}>{listTK.length}</span> bộ
          là:{' '}
        </span>
        <span
          id="total_debt"
          style={{
            color: 'red',
            fontWeight: 'bold',
          }}
        >
          {listTK.length > 0
            ? listTK
                .map((element) => element.TONG_TIEN)
                .reduce((sum, current) => sum + current)
                .toLocaleString('vi')
            : 0}
        </span>
        <span className="bold"> đồng.</span>
        {/* <span className="text-center" colSpan="4">
          <img
            src={'chrome-extension://' + extensionID + '/' + 'icon-bat-34.png'}
            alt="Batman icon"
          />
        </span> */}
        <hr />
      </div>
    );
  };

  return (
    <div id="list-component">
      <TotalMoney />
      <div className="cls"></div>
      <div style={{ minHeight: '100px', overflow: 'scroll' }}>
        <table id="dsTable" className="width100">
          <thead>
            <tr className="bold">
              <th className="width45px text-center">#</th>
              <th className="width45px text-center">STT</th>
              <th className="text-center">TK Nộp Phí</th>
              <th className="text-center">Hàng</th>
              <th className="text-center">TK hải quan</th>
              <th className="text-center">Doanh nghiệp khai báo</th>
              <th className="text-center">Ngày TK</th>
              <th className="text-center">Trạng thái</th>
              <th className="text-center width50px">TT</th>
              <th className="text-center">Số tiền</th>
              <th className="text-center" style={{ width: '118px' }}>
                Phát hành
              </th>
              <th className="text-center">Status</th>
              <th className="text-center">F5</th>
              <th className="text-center">Xoá</th>
            </tr>
          </thead>
          <tbody>
            {/*-------------- DANH SÁCH TỜ KHAI ĐÃ THÊM------------ */}
            {sortedList.map((item, index) => (
              <ItemComponent
                key={index}
                item={item}
                index={index}
                removeHandler={removeHandler}
                totalItem={listTK.length}
                issueHandler={issueHandler}
                loadingStatus={loadingStatus}
                issueStatus={issueStatus}
                getInfo={getInfo}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListComponent;
