import React from 'react';

const FullListComponents = (props) => {
  const { fullList } = props;

  let sortedList = [...fullList];

  sortedList.reverse();

  // console.log(sortedList);

  const Header = () => {
    return (
      <thead>
        <tr className="bold">
          <th className="width45px text-center">#</th>
          <th className="width45px text-center">STT</th>
          <th className="text-center">Hàng</th>
          <th className="text-center">TK hải quan</th>
          <th className="text-center">TK Nộp Phí</th>
          <th className="text-center">Doanh nghiệp khai báo</th>
          <th className="text-center">Ngày TK</th>
          <th className="text-center">Trạng thái</th>
          <th className="text-center width50px ">TT</th>
          <th className="text-center">Số tiền</th>
          {/* <th className="text-center" style={{ width: '118px' }}>
            Phát hành
          </th>
          <th className="text-center">Status</th>
          <th className="text-center">F5</th>
          <th className="text-center">Xoá</th> */}
        </tr>
      </thead>
    );
  };
  const Body = (props) => {
    const {
      item,
      index,
      removeHandler,
      totalItem,
      issueHandler,
      loadingStatus,
      issueStatus,
      getInfo,
    } = props;

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
        break;
    }

    const dateTK = !item.NGAY_TK_HQ.includes('Date')
      ? item.NGAY_TK_HQ
      : parseInt(item.NGAY_TK_HQ.match(/[0-9]/g).join(''));

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

    /**
     * ! Trạng thái BL
     */
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
        blStatus = (
          <span className="color-green">
            <i className="fa fa-check-square-o"></i>BL -
          </span>
        );
        break;
      case 1:
        blStatus = (
          <span className="color-green">
            <i className="fa fa-check-square-o"></i>BL -
          </span>
        );
        break;
      case 2:
        blStatus = (
          <span className="color-green">
            <i className="fa fa-check-square-o"></i>BL -
          </span>
        );
        break;
      default:
        blStatus = '';
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
      <tbody>
        <tr>
          <td className="text-center row1">
            <a
              href="#"
              onClick={() =>
                window.open(
                  'http://' +
                    window.location.hostname +
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
          <td className="text-center row1">{totalItem - index}</td>

          {/* ------------------LOẠI HÀNG-------------------------- */}
          <td className="text-center row1">{type}</td>

          {/* ------------------SỐ TỜ KHAI HẢI QUAN-------------------------- */}
          <td
            className="text-center row1"
            style={{ color: 'red', fontWeight: 'bold' }}
          >
            {item.SO_TKHQ}
          </td>

          {/* -----------------SỐ TỜ KHAI NỘP PHÍ--------------------------- */}
          <td className="text-center row1 bold" style={{ color: 'black' }}>
            {item.SO_TK_NOP_PHI}
          </td>

          {/* ----------------TÊN DOANH NGHIỆP---------------------------- */}
          <td
            className="text-left row1"
            style={{ fontWeight: 'normal', width: 'auto' }}
          >
            <span className="color-blue">{item.MA_DV_KHAI_BAO} - </span>
            {item.TEN_DV_KHAI_BAO}
          </td>
          {/* ------------------NGÀY TỜ KHAI-------------------------- */}
          <td className="text-center row1">{getDate(dateTK)}</td>

          {/* ------------------SỐ BIÊN LAI-------------------------- */}
          <td className="text-center row1">
            <span>
              {blStatus} {receiptNumber}
            </span>
          </td>

          {/* -------------HÌNH THỨC THANH TOÁN------------------------------- */}
          <td
            className="text-center row1"
            style={{ color: '#B146C2', fontWeight: 'bold' }}
          >
            {item.MA_LOAI_THANH_TOAN}
          </td>

          {/* -------------SỐ TIỀN------------------------------- */}
          <td
            className="text-right row1"
            style={{ color: '#012a4a', fontWeight: 'bold' }}
          >
            {item.TONG_TIEN.toLocaleString('vi')}
          </td>
        </tr>
      </tbody>
    );
  };

  return (
    <table style={{ margin: '0 auto' }}>
      <Header />
      {sortedList.map((item, index) => (
        <Body
          key={index}
          item={item}
          index={index}
          totalItem={fullList.length}
        />
      ))}
    </table>
  );
};

export default FullListComponents;
