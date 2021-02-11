import React from 'react';
// import logo from '../../assets/img/logo.svg';
// import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const extensionID = chrome.runtime.id;
  return (
    <div>
      <img
        src={'chrome-extension://' + extensionID + '/' + 'batman-signal.gif'}
        style={{ width: 'auto' }}
      />
    </div>
  );
};

export default Popup;
