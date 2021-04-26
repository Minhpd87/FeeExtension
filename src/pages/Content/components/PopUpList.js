import React from 'react';

import 'reactjs-popup/dist/index.css';
import printJS from 'print-js';

const PopUpList = () => {
  const fullList = JSON.parse(window.localStorage.getItem('full_list')) || [];
  fullList.reverse();
  // console.log(fullList);

  let actualList = [];
  let undone = [];

  let y = 0;

  for (let i = 0; i < fullList.length; i++) {
    if (fullList[i].SO_TKHQ.length > 0) {
      fullList[i] = { index2: y, ...fullList[i] };
      if (fullList[i].TRANG_THAI_BL < 1) {
        undone = undone.concat(fullList[i]);
      }
      y++;
      actualList = actualList.concat(fullList[i]);
    }
  }

  const dateTK = (item) => {
    if (!item.NGAY_TK_HQ.includes('Date')) {
      return item.NGAY_TK_HQ;
    } else return parseInt(item.NGAY_TK_HQ.match(/[0-9]/g).join(''));
  };

  const getDate = (date) => {
    try {
      if (!date.includes('Date')) {
        return date;
      }
    } catch (e) {}
    const currentDate = new Date(date);
    return [
      currentDate.getDate(),
      currentDate.getMonth() + 1,
      currentDate.getFullYear(),
    ].join('/');
  };

  const ItemInfo = ({ item, index }) => {
    let blStatus = '';
    switch (item.TRANG_THAI_BL) {
      case -3:
        blStatus = (
          <span className="color-blue">
            <i className="fa fa-check"></i> Đã khai báo
          </span>
        );
        break;
      case -2:
        blStatus = (
          <span>
            <i className="fa fa-close"></i> Xoá để viết lại
          </span>
        );
        break;
      case -1:
        blStatus = (
          <span className="red">
            <i className="fa fa-trash"></i> Đã huỷ
          </span>
        );
        break;
      case 0:
        blStatus = <span className="color-green"></span>;
        break;
      case 1:
        blStatus = <span className="color-green"></span>;
        break;
      case 2:
        blStatus = <span className="color-green"></span>;
        break;
      default:
        blStatus = '';
    }

    //Case type
    let type = '';
    switch (item.LOAI_TK_NP) {
      case 100:
        type = <span style={{ color: 'green' }}>100</span>;
        break;
      case 101:
        type = <span style={{ color: '#007A99' }}>101</span>;
        break;
      case '100':
        type = <span style={{ color: 'green' }}>100</span>;
        break;
      case '101':
        type = <span style={{ color: '#007A99' }}>101</span>;
        break;
      default:
        type = <span style={{ color: '#007A99' }}>{item.LOAI_TK_NP}</span>;
        break;
    }

    //Case số biên lai
    let receiptNumber = '';
    if (item.HAS_BIENLAI === null) {
      receiptNumber = '';
    }
    if (
      (item.HAS_BIENLAI === true && item.TRANG_THAI_BL === 2) ||
      (item.HAS_BIENLAI === true && item.TRANG_THAI_BL === 1) ||
      (item.HAS_BIENLAI === true && item.TRANG_THAI_BL === 0)
    ) {
      receiptNumber = (
        <a
          href="#"
          onClick={() =>
            window.open(
              'http://' +
                window.location.hostname +
                ':8224/Viewer/HoaDonViewer.aspx?mhd=' +
                item.EINVOICE_LINK,
              'example',
              'width=800,height=800'
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
    }

    return (
      <tr key={index}>
        <td className="text-center row1">
          {actualList.length - item.index2 || ''}
        </td>
        <td className="text-center row1">{type}</td>
        <td
          className="text-center row1"
          style={{ color: 'red', fontWeight: 'bold' }}
        >
          {item.SO_TKHQ}
        </td>

        <td className="text-center row1 bold" style={{ color: 'black' }}>
          {item.SO_TK_NOP_PHI}
        </td>

        <td
          className="text-left row1"
          style={{ fontWeight: 'normal', width: 'auto' }}
        >
          <span className="color-blue">{item.MA_DV_KHAI_BAO} - </span>
          {item.TEN_DV_KHAI_BAO}
        </td>

        <td className="text-center row1">{getDate(dateTK(item))}</td>

        <td className="text-center row1">
          <span>
            {blStatus} {receiptNumber}
          </span>
        </td>

        <td
          className="text-right row1"
          style={{ color: '#012a4a', fontWeight: 'bold' }}
        >
          {item.TONG_TIEN.toLocaleString('vi')}
        </td>
      </tr>
    );
  };

  const printList = () => {
    let scrollable = document.getElementById('full-table');
    scrollable.style.overflow = '';
    printJS({
      printable: scrollable,
      type: 'html',
      targetStyles: ['*'],
      style: '@page {margin: 1cm}',
      font_size: '12px;',
    });
    scrollable.style.overflow = 'scroll';
  };

  return (
    <div id="printSection">
      <a
        href="#"
        className="btn-add "
        style={{ float: 'left', display: '', margin: '0 5px 5px 5px' }}
        onClick={printList}
      >
        <i className="fa fa-print"></i> Print
      </a>
      <div className="cls"></div>
      <div
        id="overflow-tbl"
        style={{
          maxHeight: '80vh',
          overflow: 'scroll',
          background: 'white',
        }}
      >
        <table
          className="width100 popup-table"
          id="full-table"
          style={{ border: '1px solid #ddd' }}
        >
          <thead>
            <tr className="bold" style={{ border: '1px solid #ccc' }}>
              <th colSpan="4">
                <div style={{ textAlign: 'center' }} className="bold">
                  {undone.length} / {actualList.length}
                </div>
              </th>
              <th className="text-center row1 bold" colSpan="1">
                DANH SÁCH TỜ KHAI HẢI QUAN ĐÃ THÊM NGÀY{' '}
                {new Date().toLocaleDateString('vi')}
              </th>
              <th className="bold" colSpan="3">
                <div style={{ textAlign: 'center' }}>
                  <span className="bold">
                    Có <span style={{ color: 'red' }}>{actualList.length}</span>{' '}
                    bộ:{' '}
                  </span>
                  <span
                    style={{
                      color: 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {fullList.length > 0
                      ? fullList
                          .map((element) => parseInt(element.TONG_TIEN) || 0)
                          .reduce((sum, current) => sum + current)
                          .toLocaleString('vi')
                      : 0}
                  </span>
                  <span className="bold"> đồng.</span>
                </div>
              </th>
            </tr>
            <tr className="bold" style={{ border: '1px solid #ccc' }}>
              <th className="width45px text-center row1 sticky-th">STT</th>
              <th className="text-center row1 sticky-th">Hàng</th>
              <th className="text-center row1 sticky-th">TK hải quan</th>
              <th className="text-center row1 sticky-th">TK Nộp Phí</th>
              <th className="text-center row1 sticky-th">
                Doanh nghiệp khai báo
              </th>
              <th className="text-center row1 sticky-th">Ngày TK</th>
              <th className="text-center row1 sticky-th">Trạng thái</th>
              <th className="text-center row1 sticky-th">Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {fullList.map((item, index) => (
              <ItemInfo item={item} index={index} key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PopUpList;
