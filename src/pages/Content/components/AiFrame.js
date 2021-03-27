import React from 'react';

const AiFrame = (props) => {
  const { url } = props;

  const loaded = () => {
    try {
      const myFrame = document.getElementById('ai-frame');
      const name = myFrame.contentWindow.document.getElementsByClassName(
        'form-control input-sm'
      )[2].value;
      if (name === '') {
        myFrame.contentWindow.document.getElementsByClassName(
          'form-control input-sm'
        )[2].value = 'không có tên';
      }

      let payment = myFrame.contentWindow.document.getElementsByName(
        'MA_LOAI_THANH_TOAN'
      )[0].value;
      const diemthu = myFrame.contentWindow.document.getElementsByName(
        'MA_TRAM_TP'
      )[0].value;

      if (diemthu === 'VP') {
        myFrame.contentWindow.document.getElementsByName(
          'MA_LOAI_THANH_TOAN'
        )[0].value = 'CK247';
      }
      console.log('Thanh toan:', payment, diemthu);

      // console.log(name);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <iframe
      id="ai-frame"
      src={url}
      title="test"
      onLoad={loaded}
      style={{ width: '1000px', height: '1000px', display: 'none' }}
    />
  );
};

export default AiFrame;
