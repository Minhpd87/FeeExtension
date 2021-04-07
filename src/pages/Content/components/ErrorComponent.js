/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

const ErrorComponent = (props) => {
  const { errorMessage } = props;

  let renderItem = null;

  if (typeof errorMessage === 'object') {
    renderItem = (
      <div
        style={{
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            display: 'inline-block',
            fontWeight: 'bold',
            fontSize: '16px',
            fontStyle: 'italic',
            // fontFamily: 'Arial',
            border: '1px solid #ccc',
            padding: '5px 15px',
            borderRadius: '2px',
            background: '#f9f9f9',
          }}
        >
          Tờ Khai <span className="red">{errorMessage.SO_TKHQ}</span> -
          <span className="color-blue"> {errorMessage.MA_DV_KHAI_BAO} - </span>
          <span className="color-green">{errorMessage.TEN_DV_KHAI_BAO}</span> đã
          có biên lai số
          <a
            href="#"
            onClick={() =>
              window.open(
                'http://' +
                  window.location.hostname +
                  ':8224/Viewer/HoaDonViewer.aspx?mhd=' +
                  errorMessage.EINVOICE_LINK,
                'example',
                'width=auto,height=800'
              )
            }
            style={{ fontWeight: 'bold' }}
          >
            <span style={{ color: '#007A99' }}> {errorMessage.MA_TRAM_TP}</span>
            <span style={{ color: 'black' }}>&nbsp;-&nbsp;</span>
            <span style={{ color: '#FF6633' }}>
              {errorMessage.SO_BIEN_LAI.padStart(7, '0')}
            </span>
          </a>
        </div>
        <div
          style={{ borderBottom: '1px solid #eee', margin: '10px 0 10px 0' }}
        ></div>
      </div>
    );
  }

  if (typeof errorMessage === 'string' && errorMessage.length !== 0) {
    let errorArray = errorMessage.split('|');
    renderItem = (
      <div
        style={{
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            display: 'inline-block',
            fontWeight: 'bold',
            border: '1px solid #ccc',
            padding: '0px 15px',
            borderRadius: '2px',
            background: '#eee',
          }}
        >
          {/* <span className="error" style={{ whiteSpace: 'pre-line' }}>
            {errorMessage}
          </span> */}
          {errorArray.map((e, index) => (
            <p className="error" key={index}>
              {index + 1} - {e}
            </p>
          ))}
        </div>
        <div
          style={{ borderBottom: '1px solid #eee', margin: '10px 0 10px 0' }}
        ></div>
      </div>
    );
  }

  return renderItem;
};

export default ErrorComponent;
