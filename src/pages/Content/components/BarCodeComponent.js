/* eslint-disable no-loop-func */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import XLSX from 'xlsx';
// import axios from 'axios';

import './Barcode.css';

import { useAlert } from 'react-alert';

import InputComponent from './InputComponent';
import ListComponent from './ListComponent';
import ErrorComponent from './ErrorComponent';
import Change from './Change';
import AiFrame from './AiFrame';

const BarcodeComponent = () => {
  const currentPath = window.location.pathname;

  // axios.defaults.withCredentials = true;

  const verificationToken = document.querySelector(
    '[name=__RequestVerificationToken]'
  ).value;

  /**
   * ! Stateful variables
   */
  const [dsTKHQ, setDS] = useState([]);
  const [fullList, setFullList] = useState([]);
  const [list247, set247] = useState([]);
  const [currentTK, setCurrentTK] = useState('');
  const [issueState, setIssueState] = useState();
  const [searchLoading, setSearch] = useState(false);
  const [loadingState, setLoadingState] = useState([]);
  const [errorMessage, setError] = useState('');
  const [iURL, setIURL] = useState('');
  const [currentStart, setCurrentStart] = useState('');
  const [currentEnd, setCurrentEnd] = useState('');

  /**
   * ! Load current List from Local Storage
   */
  useEffect(() => {
    const localDanhSach = () =>
      JSON.parse(window.localStorage.getItem('danh_sach_tk')) || [];

    setDS(localDanhSach !== null ? localDanhSach : []);

    const localFull = () =>
      JSON.parse(window.localStorage.getItem('full_list')) || [];
    setFullList(localFull);

    //Set Loading State for individual items
    const currentLoadingState = new Array(localDanhSach.length).fill(false);
    const currentStatus = new Array(localDanhSach.length).fill('');
    // const ds247 = () =>
    //   JSON.parse(window.localStorage.getItem('list247')) || [];
    // set247(ds247);
    setLoadingState(currentLoadingState);
    setIssueState(currentStatus);
    window.localStorage.setItem('error', '');
  }, []);

  // console.log(loadingState);
  /**
   * ! Read XLSX File
   */
  const readXLS = (xlsFile) => {
    // XLSX.utils.json_to_sheet(data, 'out.xlsx');
    let result = [];
    let noID = [];
    if (xlsFile) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(xlsFile);
      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: 'binary' });
        //Read only first sheet
        let rowObject = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );
        console.log(rowObject);
        const maxLength = rowObject.length;
        let thisEnd;

        if (currentStart === '') {
          setCurrentStart(1);
        }
        if (currentEnd >= maxLength || currentEnd === '') {
          setCurrentEnd(maxLength);
          thisEnd = maxLength;
        }

        console.log(
          `Read from`,
          currentStart !== '' ? currentStart : 0,
          thisEnd
        );

        thisEnd =
          currentEnd !== '' && currentEnd <= maxLength ? currentEnd : thisEnd;

        for (let i = 0; i < thisEnd; i++) {
          let element = rowObject[i].dg;
          if (element === undefined) {
            element = rowObject[i].nd;
          }
          try {
            if (element.includes('ID_CT: ')) {
              element = element.replace('ID_CT: ', 'ID_CT:');
            }
            if (element.includes('ID_CT:')) {
              result = result.concat(
                element
                  .match(/CT:[0-9]{5,}/g)
                  .join('')
                  .replace('CT:', '')
              );
            } else if (element.includes('+TKNS3511')) {
              result = result.concat(
                element
                  .match(/ID[0-9]{5,}/g)
                  .join('')
                  .replace('ID', '')
              );
            } else {
              noID = noID.concat(element);
            }
          } catch (error) {
            let currentError = window.localStorage.getItem('error') || '';
            setError(
              `${currentError} Lỗi đọc chứng từ A ${element} at ${i + 1} ${
                error.message
              } |`
            );
            window.localStorage.setItem(
              'error',
              `${currentError} Lỗi đọc chứng từ A ${element} at ${i + 1} ${
                error.message
              } |`
            );
          }
        }
        // JSON.stringify(rowObject, undefined, 4);

        console.log(result);
        console.table(noID);
        window.localStorage.setItem('DSTK', JSON.stringify(result));
        importAndAdd(result, currentStart !== '' ? currentStart - 1 : 0);
        return result;
      };
    }
    return result;
  };

  /**
   * ! Filter List
   */
  const filterList = (event) => {
    // if (event.target.checked === true) {
    event.preventDefault();
    const currentList = JSON.parse(window.localStorage.getItem('danh_sach_tk'));
    let filtered = [];
    for (let i = 0; i < currentList.length; i++) {
      if (currentList[i].TRANG_THAI_BL < 1) {
        filtered = filtered.concat(currentList[i]);
      }
    }
    setDS(filtered);
    window.localStorage.setItem('danh_sach_tk', JSON.stringify(filtered));
    // } else {
    //   const arr = () => JSON.parse(window.localStorage.getItem('danh_sach_tk'));
    //   console.log(arr);
    //   setDS(arr);
    // }
  };

  /**
   * ! Get and Add from Excel files
   */

  const importAndAdd = (arr, start) => {
    const target = '/DToKhaiNopPhi/GetThongBaoNP_TaoBienLai/';
    let list_247 = [];
    let un_done = [...dsTKHQ];
    // let currentList = [...dsTKHQ];

    const delay = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const getID = async (element) => {
      let data = new FormData();
      data.append('SO_TK', element);
      const response = await fetch(target, {
        method: 'POST',
        body: data,
        headers: {
          __RequestVerificationToken: verificationToken,
        },
        credentials: 'same-origin',
      });
      let localResult = await response.json();
      return localResult;
    };

    const getToAdd = (i) => {
      const element = arr[i];
      // console.log(element);
      setSearch(true);
      delay(1).then(async () => {
        let localResult = await getID(element);

        // let eleArray = [];
        // for (let y = 0; y < 5; y++) {
        //   eleArray = eleArray.concat(arr[i + y]);
        // }

        // const xArray = await Promise.all([getID])

        try {
          if (localResult.DANHSACH.length >= 1) {
            localResult.DANHSACH.sort(
              (a, b) => a.TRANG_THAI_BL - b.TRANG_THAI_BL
            );
            let item = localResult.DANHSACH[localResult.DANHSACH.length - 1];
            if (item.TRANG_THAI_BL < 1) {
              item.TEN_DV_KHAI_BAO =
                item.TEN_DV_KHAI_BAO + ` - Chứng từ: ${element}`;
              un_done = un_done.concat(item);
              console.log(localResult.DANHSACH);
            }

            if (item !== null) {
              list_247 = list_247.concat(item);
            }
            // window.localStorage.setItem('list247', JSON.stringify(list_247));
            window.localStorage.setItem(
              'danh_sach_tk',
              JSON.stringify(un_done)
            );
            setDS(un_done);
            set247(list_247);
            i++;
            setSearch(false);
            if (i < arr.length) {
              getToAdd(i);
            } else {
              // console.log(`Done looping`);
            }
          } else {
            let currentError = window.localStorage.getItem('error') || '';
            setError(
              `${currentError} Lỗi lấy thông tin chứng từ A: ${element} at ${
                i + 1
              } | \n`
            );
            window.localStorage.setItem(
              'error',
              `${currentError} Lỗi lấy thông tin chứng từ A: ${element} at ${
                i + 1
              } | \n`
            );
            getToAdd(i + 1);
            // setTimeout(() => setError(''), 3000);
            // setCurrentStart(i + 1);
            // setSearch(false);
          }
        } catch (error) {
          console.log(`${element} is error ${error.message}`);
          let currentError = window.localStorage.getItem('error') || '';
          setError(
            `${currentError} Lỗi lấy thông tin chứng từ B: ${element} at ${
              i + 1
            } |`
          );
          window.localStorage.setItem(
            'error',
            `${currentError} Lỗi lấy thông tin chứng từ B: ${element} at ${
              i + 1
            } |`
          );
          if (i + 1 < arr.length) {
            getToAdd(i + 1);
          }
        }
      });
    };

    getToAdd(start);
  };

  /**
   * ! Differnt type of alert
   */
  const alert = useAlert();
  const makeAlert = (message, type) => {
    // event.preventDefault();
    // Info alert
    if (type === undefined) {
      alert.info(message, {});
    }
    // Succes alert
    if (type === 'success') {
      alert.success(message, {});
    }
    // Error alert
    if (type === 'error') {
      alert.error(message, {});
    }
  };

  /**
   * ! Lấy thông tin 1 hoặc nhiều tờ khai
   */
  const getInfo = async (arr) => {
    window.localStorage.setItem('issued', 'none');
    event.preventDefault();
    if (searchLoading) {
      return;
    }

    if (arr === undefined || arr.length === 0) {
      setError('Chưa có tờ khai nào!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // setSearch(true);

    // console.log('Getting info of: ', arr, typeof arr);
    const data = new FormData();
    let result;

    const target = '/DToKhaiNopPhi/GetThongBaoNP_TaoBienLai/';

    //Get multiple to khai in sequence
    const delay = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    if (Array.isArray(arr) && arr.length > 0) {
      const getInfoArray = (i) => {
        setSearch(true);

        // console.log(`Info of ${arr[i]}`);
        const updateLoading = (value) => {
          // console.log(`Thay doi status cua ${index} thành ${value}`);
          let current = [...loadingState];
          current[i] = value;
          // let element = document.getElementById(`bl-of-${arr.length - i - 1}`);
          // element.scrollIntoView(true);
          // window.scrollBy(0, -35);

          setLoadingState(current);
          // console.log(current);
        };

        updateIssueStatus(i, `Refreshing...`);

        const element = arr[i];
        delay(1).then(async () => {
          try {
            updateLoading(true);
            let data = new FormData();
            data.append('SO_TK', element);
            const response = await fetch(target, {
              method: 'POST',
              body: data,
              headers: {
                __RequestVerificationToken: verificationToken,
              },
              credentials: 'same-origin',
            });
            let elementInfo = await response.json();

            let newElement = null;
            if (elementInfo.DANHSACH.length >= 1) {
              elementInfo.DANHSACH.sort(
                (a, b) => a.TRANG_THAI_BL - b.TRANG_THAI_BL
              );
              newElement =
                elementInfo.DANHSACH[elementInfo.DANHSACH.length - 1];
              newElement.TEN_DV_KHAI_BAO =
                newElement.TEN_DV_KHAI_BAO +
                ` ${new Date().toLocaleTimeString('vi')}`;
              updateDS3(newElement);
              updateLoading(false);
              updateIssueStatus(i, ``);
              i--;
              if (i >= 0) {
                getInfoArray(i);
              } else {
                setSearch(false);
                // console.log(`Done looping`);
                return null;
              }
            } else {
              setError(
                errorMessage + `Lỗi lấy thông tin chứng từ ${element} | `
              );
              updateIssueStatus(i, `Lỗi!`);
              setTimeout(() => setError(''), 3000);
              // setCurrentStart(i);
              setSearch(false);
              updateLoading(false);
            }
          } catch (e) {
            setSearch(false);
            setError(`${e.message}, F5 để đăng nhập lại`);
            updateLoading(false);
          }
        });
      };
      getInfoArray(arr.length - 1);
    }

    // Getting single to khai
    if (
      (typeof arr === 'string' || 'number') &&
      arr.length < 13 &&
      !Array.isArray(arr)
    ) {
      setSearch(true);
      const currentArr = [...dsTKHQ];
      const found = currentArr.findIndex((e) => e.SO_TKHQ === arr);
      const currentLoading = [...loadingState];
      currentLoading[found] = true;
      setLoadingState(currentLoading);
      data.append('SO_TK', arr);
      updateIssueStatus(found, 'Refreshing...');
      const response = await fetch(target, {
        method: 'POST',
        body: data,
        headers: {
          __RequestVerificationToken: verificationToken,
        },
        credentials: 'same-origin',
      });
      let fetchedData = await response.json();
      fetchedData.DANHSACH.sort((a, b) => a.TRANG_THAI_BL - b.TRANG_THAI_BL);
      setSearch(false);
      setLoadingState(loadingState.fill(false));
      updateDS3(fetchedData.DANHSACH[fetchedData.DANHSACH.length - 1]);
      updateIssueStatus(found, '');
      return fetchedData.DANHSACH[fetchedData.DANHSACH.length - 1];
    }

    // setSearch(false);
    setLoadingState(loadingState.fill(false));
    return result;
  };

  const updateDS3 = (newElement) => {
    // console.log(newElement);
    try {
      const currentArr = JSON.parse(
        window.localStorage.getItem('danh_sach_tk')
      );
      const found = currentArr.findIndex(
        (e) => e.SO_TKHQ === newElement.SO_TKHQ
      );
      // console.log(found);
      newElement.TEN_DV_KHAI_BAO = currentArr[found].TEN_DV_KHAI_BAO;
      currentArr[found] = newElement;
      // console.log('DSTKHQ:', dsTKHQ);
      // console.log('CurrentARR:', currentArr);
      setDS(currentArr);
      window.localStorage.setItem('danh_sach_tk', JSON.stringify(currentArr));
      // window.localStorage.setItem('issued', 'true');
      // window.dispatchEvent(new Event('storage'));
      // window.location.reload();
    } catch (e) {
      console.log(e.message);
    }
  };

  /**
   * ! Lấy thông tin and add tờ khai hải quan
   */
  const getInfoAndAdd = (event, soTKHQ) => {
    setError(''); //Reset Error
    event.preventDefault();
    document.getElementById('inputTK').focus();

    //Fetching POST
    const data = new FormData();
    data.append('SO_TK', soTKHQ);
    const target = '/DToKhaiNopPhi/GetThongBaoNP_TaoBienLai/';
    setSearch(true);

    fetch(target, {
      method: 'POST',
      body: data,
      headers: {
        __RequestVerificationToken: verificationToken,
      },
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.code !== 1) {
          setError(data.Des);
          setTimeout(() => setError(''), 5000);
          setSearch(false);
        } else {
          // console.log('Tim thay cac to khai: ', data.DANHSACH);
          //Check if already added

          const currentDS =
            JSON.parse(window.localStorage.getItem('danh_sach_tk')) || [];
          const item = data.DANHSACH[data.DANHSACH.length - 1];

          // console.log(data.DANHSACH.length);

          if (data.DANHSACH.length === 0) {
            setError('Không tìm thấy tờ trên');
            setTimeout(() => setError(''), 5000);
            setSearch(false);
            return;
          }

          // console.log(`Tờ khai vừa chít: `);
          // console.log(item, currentDS);

          const added = currentDS
            .map((e) => e.DTOKHAINPID)
            .includes(item.DTOKHAINPID);

          if (added) {
            setSearch(false);
            setError(`Đã có tờ khai ${soTKHQ} !`);
            return;
          }

          //Check if has Biên lai already
          let checkpoint = null;

          for (let i = 0; i < data.DANHSACH.length; i++) {
            const element = data.DANHSACH[i];
            if (element.TRANG_THAI_BL === 2 || element.TRANG_THAI_BL === 1) {
              checkpoint = element;
            }
          }

          // console.log(checkpoint);

          // Check if has Bien lai
          if (checkpoint !== null) {
            setError(checkpoint);
            setSearch(false);
          } else {
            //update state
            const newList = dsTKHQ.concat(
              data.DANHSACH[data.DANHSACH.length - 1]
            );
            setDS(newList);
            setSearch(false);
            setCurrentTK('');
            //save to local storage
            window.localStorage.setItem(
              'danh_sach_tk',
              JSON.stringify(newList)
            );
            // console.log(dsTKHQ);
          }
        }
      });

    //Set focus to the input
    document.getElementById('inputTK').focus();
  };

  /**
   * ! Xoá Tờ khai handler
   */
  const removeHandler = (event, index) => {
    event.preventDefault();
    try {
      // console.log('Trying to remove', index);

      let currentArr = [...dsTKHQ];
      makeAlert(`Đã xoá tờ khai ${currentArr[index].SO_TKHQ}`, 'error');
      currentArr.splice(index, 1);
      setDS(currentArr);
      window.localStorage.setItem('danh_sach_tk', JSON.stringify(currentArr));
      setCurrentTK('');

      //Set focus to the input
      document.getElementById('inputTK').focus();
    } catch (e) {
      console.log(e.message);
    }
  };

  /**
   * ! Delete All Handler
   */
  const deleteAllHandler = () => {
    if (dsTKHQ.length === 0) {
      makeAlert('Hem có gì để xóa bạn êiii');
      return;
    }

    const check = window.localStorage.getItem('isIssuing');
    if (check === 'true') {
      setError('Không xóa DS khi đang phát hành biên lai.');
      return;
    }

    let currentFullList =
      JSON.parse(window.localStorage.getItem('full_list')) || [];

    const separator = {
      // DTOKHAINPID: 2901516,
      SO_TK_NOP_PHI: ``,
      SO_TKHQ: ``,
      NGAY_TK_HQ: ``,
      MA_DV_KHAI_BAO: `Thêm vào lúc: ` + new Date().toLocaleString('vi'),
      TEN_DV_KHAI_BAO: ``,
      MA_TRAM_TP: '',
      TEN_TRAM_TP: null,
      MA_LOAI_THANH_TOAN: '',
      LOAI_TK_NP: '',
      TONG_TIEN: '',
      HAS_BIENLAI: true,
      EINVOICE_CODE: '',
      EINVOICE_LINK: '',
      SO_BIEN_LAI: '',
      TRANG_THAI_BL: '',
    };

    currentFullList = currentFullList.concat(dsTKHQ);
    currentFullList = currentFullList.concat(separator);
    setFullList(currentFullList);
    window.localStorage.setItem('full_list', JSON.stringify(currentFullList));

    setCurrentTK('');
    setDS([]);
    setError('');
    setLoadingState([false]);
    setCurrentStart('');
    setCurrentEnd('');
    set247('');
    window.localStorage.setItem('danh_sach_tk', JSON.stringify([]));
    window.localStorage.setItem('list247', JSON.stringify([]));
    window.localStorage.setItem('DSTK', JSON.stringify([]));
    window.localStorage.setItem('currentList', JSON.stringify([]));
    window.localStorage.setItem('issued', 'none');
    window.localStorage.setItem('error', '');
    makeAlert('Đã xoá hết các tờ khai!', 'success');
    //Set focus to the input
    // window.location.reload();
    // document.getElementById('inputTK').focus();
    document.getElementById('total_debt').innerHTML = 0;
    document.getElementById('cls-change').click();
  };

  /**
   * ! IssueStatus Handler
   */
  const updateIssueStatus = (index, message) => {
    const current = [...issueState];
    current[index] = message;
    setIssueState(current);
  };

  /**
   * ! Multi Issue
   */
  const multiIssue = (arr) => {
    event.preventDefault();
    const delay = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    let arrWithNoBL = [];

    for (let i = 0; i < arr.length; i++) {
      let element = arr[i];
      if (element.TRANG_THAI_BL < 1) {
        // console.log(element);
        arrWithNoBL = arrWithNoBL.concat(element);
      }
    }

    console.log(`Cac to khai chua co BL:`, arr, arrWithNoBL);
    let noBLIndex = [];

    for (let i = 0; i < arrWithNoBL.length; i++) {
      let index = arr.findIndex((e) => e === arrWithNoBL[i]);
      noBLIndex = noBLIndex.concat(arr.length - 1 - index);
    }

    console.log(
      `Cac to khai chua co BL:`,
      noBLIndex.sort((a, b) => a - b)
    );

    if (arrWithNoBL.length === 0) {
      console.log('Đã có BL hết');
      makeAlert(`Đều đã có Biên lai`);
      return;
    }

    const clickIssueButton = (i) => {
      window.localStorage.setItem('isIssuing', 'true');
      delay(200).then(() => {
        // let blStatus = document.getElementById(`bl-of-${i}`);
        let button = document.getElementById(`issue-btn-${noBLIndex[i]}`);

        if (button === null) {
          setError(`Không có tờ khai nào!`);
          setTimeout(() => setError(''), 2000);
          return;
        }

        // let button = document.getElementById(`f5-btn-${i}`);
        console.log(`Item ${i + 1}/${noBLIndex.length}`);
        button.click();

        window.onstorage = () => {
          let check = window.localStorage.getItem('issued');
          console.log(`Target is:`, check);
          if (check !== 'none') {
            i++;
            console.log('Next', i, noBLIndex[i]);
            if (i < noBLIndex.length) {
              clickIssueButton(i);
            } else {
              window.localStorage.setItem('isIssuing', 'false');
              console.log(`Done multi issue`);
            }
          } else {
            return;
          }
        };
      });
    };

    clickIssueButton(0);
  };

  /**
   * ! Xuất tờ khai Handler
   */
  const issueHandler = (item, index) => {
    window.localStorage.setItem('issued', 'none');
    console.log(`Phát hành thứ tự ${index} `);
    console.log(item);
    event.preventDefault();
    setError('');
    document.getElementById('inputTK').focus({ preventScroll: true });

    if (
      loadingState.includes(true) ||
      (item.SO_BIEN_LAI > 0 &&
        (item.TRANG_THAI_BL === 1 || item.TRANG_THAI_BL === 2))
    ) {
      return;
    }

    const updateLoading = (value) => {
      // console.log(`Thay doi status cua ${index} thành ${value}`);
      let current = [...loadingState];
      current[index] = value;
      setLoadingState(current);
      // console.log(current);
    };

    const id = item.DTOKHAINPID;
    const id0 = item.DBIENLAI_TPID;
    const status = item.TRANG_THAI_BL;
    const blNumber = item.SO_BIEN_LAI;
    const hasBL = item.HAS_BIENLAI;
    let TRAMTP = item.MA_TRAM_TP;
    let BL000 = false;
    let invoiceNum;
    let eInvoiceLink;
    const target0 = '/DBienLaiThuPhi/CheckConditionIssuedInvoice/';
    // const target1 = '/DBienLaiThuPhi/TaoVaPhatHanhBienLaiTheoLo/';

    console.log('Xuat to khai sau day: ', id, id0, status, blNumber, hasBL);
    updateLoading(true);

    //Check if is BL 0000
    // console.log(blNumber === '', blNumber === 0);
    if ((blNumber === '0' || blNumber === 0) && hasBL === true) BL000 = true;
    let dataContent = new FormData();

    const phatHanh = (idToPhat) => {
      // console.trace();
      try {
        //Data to post
        event.preventDefault();
        dataContent.append('DBIENLAITPID', idToPhat);
        dataContent.append('hasIssuedInvoice', 0);

        // console.log(`DataContent:`);
        // console.log(dataContent.values);
        // console.log(dataContent.getAll('DBIENLAITPID'));

        if (dataContent.getAll('DBIENLAITPID').length === 1) {
          fetch(target0, {
            method: 'POST',
            body: dataContent,
            headers: {
              __RequestVerificationToken: verificationToken,
            },
            credentials: 'same-origin',
          })
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              dataContent.delete('hasIssuedInvoice');
              if (data.code === 1) {
                fetch(target0, {
                  method: 'POST',
                  body: dataContent,
                  headers: {
                    __RequestVerificationToken: verificationToken,
                  },
                  credentials: 'same-origin',
                })
                  .then((response) => response.json())
                  .then((data) => {
                    // console.log(`Đã phát hành: `, data);
                    if (data.code !== 1) {
                      //Data code error
                      setError(data.message);
                      updateLoading(false);
                      console.log(`Lỗi khi phát hành:`, data);
                      // getInfo(item.SO_TKHQ);
                      // console.log(item.SO_TKHQ);
                      window.alert(`Lỗi phát hành biên lai: ${data.message}`);
                      window.localStorage.setItem('isIssuing', 'false');
                    } else {
                      invoiceNum = data.EINVOICE_OUT.InvoiceNumber;
                      eInvoiceLink = data.EINVOICE_OUT.InvoiceKey;
                      console.log(
                        `Đã xuất:`,
                        item.DTOKHAINPID,
                        invoiceNum,
                        eInvoiceLink
                      );
                      //Update localStorage and state
                      updateIssueStatus(index, 'Thành công');
                      updateLoading(true);
                      updateDS(
                        item.DTOKHAINPID,
                        invoiceNum,
                        eInvoiceLink,
                        TRAMTP
                      );
                      updateLoading(false);
                      window.localStorage.setItem('isIssuing', 'false');
                    }
                  });
              } else if (data.code === 0) {
                console.log(data);
                updateLoading(false);
                window.localStorage.setItem('isIssuing', 'false');
                setError(data.message);
                updateIssueStatus(index, data.message);
                window.alert(`Lỗi phát hành 2:`, data.message);
                // window.location.reload();
              } else if (data.code === 2) {
                updateLoading(false);
                window.localStorage.setItem('isIssuing', 'false');
                console.log(`Lỗi: `, data.message);
              }
            });
        } else {
          // console.log('Not executing fetch, data content greater than 1');
        }
      } catch (e) {
        console.log(e.message);
        setError(e.message);
        updateIssueStatus(index, e.message);
      }
    };

    //Phat hanh BL0000
    if (BL000) {
      console.log('---Phat hanh BL 0000---');
      updateIssueStatus(index, `Issue: ${id0}`);
      updateLoading(true);
      phatHanh(id0);
    } else {
      //Phat hanh BL bình thường
      console.log('---Phat hanh BL thuong---');
      try {
        //Update URL
        // http://thuphi.haiphong.gov.vn:8221/cap-nhat-thong-tin-bien-lai-dien-tu?DTOKHAINP_ID=2743811
        const myFrame = document.getElementById('ai-frame');
        const origin = myFrame.contentWindow.document.location.search;
        updateIssueStatus(index, `Cập nhật`);
        updateLoading(true);
        //Phat hanh procedure
        const phathanh02 = () => {
          const path = myFrame.contentWindow.document.location.search;
          // console.log(`Path:`, path);
          updateIssueStatus(index, `Cập nhật`);
          updateLoading(true);

          const luuLai = myFrame.contentWindow.document.getElementsByClassName(
            'btn btn-primary mr10px btn-padding'
          )[0];

          const targetElement = myFrame.contentWindow.document.getElementsByName(
            'DBIENLAI_TPID'
          )[0];

          const DBIENLAITPID = targetElement.value;

          if (DBIENLAITPID.length > 1) {
            // console.log(`DBIENLAI_TPID exists 1:`, DBIENLAITPID);
            updateIssueStatus(index, `Issue 1: ${DBIENLAITPID}`);
            updateLoading(true);
            TRAMTP = myFrame.contentWindow.document.getElementById('MA_TRAM_TP')
              .value;
            phatHanh(DBIENLAITPID);
            return;
          }

          // console.log(path);
          // console.trace();

          if (!path.includes('MESSAGE=OK')) {
            // console.log('CHUA LUUUUUUU');
            // console.log(luuLai);

            const check = myFrame.contentWindow.document.getElementsByClassName(
              'fa fa-exclamation-triangle'
            )[0];

            if (check === undefined) {
              //No Error in cập nhật so lưu lại
              luuLai.click();
              // After this iframe will be reloaded cause of page reloading after saving so the load() got executed again
              //By then DBIENLAITPID should be existed already hence phat hanh without issue
            } else {
              //There is error in cập nhật so không lưu lại
              setError(`BL00000 hoặc đã có Biên lai`);
              console.log(`Error issuing at: ${index} of ${item}`);
              updateIssueStatus(index, 'F5 Info');
              makeAlert('BL00000 hoặc đã có Biên lai. Reload if error persits');
              // const itemInfo = async () => {
              const refreshButton = document.getElementById(`f5-btn-${index}`);
              updateLoading(false);
              window.localStorage.setItem('isIssuing', 'false');
              refreshButton.click();
            }
            updateIssueStatus(index, 'Đang lưu');
            updateLoading(true);
          } else if (path.includes('MESSAGE=OK')) {
            updateIssueStatus(index, 'Đã lưu');
            updateLoading(true);
          }
          // updateLoading(false);
        };

        //Determine if it is first or n-th try
        if (origin.includes('DTOKHAINP_ID')) {
          // N-th try
          console.log('second tries');
          updateIssueStatus(index, `Cập nhật`);
          updateLoading(true);
          phathanh02();
        } else {
          // First try
          console.log('first try');
          setIURL(`/cap-nhat-thong-tin-bien-lai-dien-tu?DTOKHAINP_ID=${id}`);
          myFrame.addEventListener('load', () => {
            phathanh02();
          });
        }
      } catch (e) {
        updateLoading(false);
        window.localStorage.setItem('isIssuing', 'false');
        window.alert(e.message);
      }
    }
    // updateLoading(false);
    document.getElementById('inputTK').focus();
  };

  /**
   * ! Update specific item in Danh sach
   */
  const updateDS = (tokhainopphi, invoiceNum, eInvoiceLink, TRAMTP) => {
    const currentArr = [...dsTKHQ];

    const currentItem = currentArr.find((e) => e.DTOKHAINPID === tokhainopphi);
    console.log(tokhainopphi, invoiceNum, eInvoiceLink);
    console.log(`Current Item:`, currentItem);
    currentItem.HAS_BIENLAI = true;
    currentItem.SO_BIEN_LAI = invoiceNum;
    currentItem.EINVOICE_LINK = eInvoiceLink;
    currentItem.TRANG_THAI_BL = 1;
    currentItem.MA_TRAM_TP = TRAMTP;

    setDS(currentArr);
    window.localStorage.setItem('danh_sach_tk', JSON.stringify(currentArr));
    window.localStorage.setItem('issued', invoiceNum);
    window.dispatchEvent(new Event('storage'));
    setCurrentTK('');
    // window.location.reload();
  };

  /**
   * ! Input Change handler
   */
  const changeInputHandler = (event) => {
    setCurrentTK(event.target.value);
  };

  return (
    <div
      className="container"
      style={{
        display: currentPath === '/tim-kiem-to-khai-nop-phi' ? '' : 'none',
      }}
    >
      <InputComponent
        value={currentTK}
        change={changeInputHandler}
        submit={(event) => getInfoAndAdd(event, currentTK)}
        click={(event) => getInfoAndAdd(event, currentTK)}
        click2={deleteAllHandler}
        loading={searchLoading}
        test={() => getInfo(dsTKHQ.map((e) => e.SO_TKHQ))}
        readXLS={readXLS}
        filterList={filterList}
        setCurrentStart={setCurrentStart}
        setCurrentEnd={setCurrentEnd}
        currentStart={currentStart}
        list247={list247 ? list247 : []}
        currentEnd={currentEnd}
      />

      <hr />
      <Change />
      <div
        style={{ borderBottom: '1px solid #eee', marginBottom: '10px' }}
      ></div>
      <ErrorComponent errorMessage={errorMessage} />
      <ListComponent
        listTK={dsTKHQ}
        removeHandler={removeHandler}
        issueHandler={issueHandler}
        loadingStatus={loadingState}
        issueStatus={issueState}
        getInfo={getInfo}
        multiIssue={() => multiIssue(dsTKHQ)}
      />
      <hr />
      <AiFrame url={iURL} />
    </div>
  );
};

export default BarcodeComponent;
