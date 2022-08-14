import React, { useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Button } from 'antd';
import style from './MyModal.less';
import Context from '../views/context';

const MyModal = (props) => {
  // const count = useContext(Context)
  // console.log(count);
  let { isShow, setIsShow, title, content, handleOK, handleCancle, ModalRef } = props;
  const contes = useContext(Context)
  console.log(contes);

  const [modaltitle, setModalTitle] = useState('标题');
  const [modalContent, setModalContent] = useState('这里是对话框内容');
  const [isSuccess, SetIsSuccess] = useState(undefined);

  useImperativeHandle(ModalRef, () => ({
    success: (message) => {
      if (message) {
        setModalTitle(message.title);
        setModalContent(message.content);
        SetIsSuccess(message.isSuccess);
        handleOK = message.onOK;
        setIsShow();
      }

    },
    error: (message) => {
      if (message) {
        setModalTitle(message.title);
        setModalContent(message.content);
        handleCancle = message.onCancel;
        SetIsSuccess(message.isSuccess);
        setIsShow();
      }
    },
  }));

  const singleBtn = () => {
    SetIsSuccess(undefined);
    setModalTitle('标题');
    setModalContent('这里是对话框内容');
    if (isSuccess === 'success') {
      handleOK();
    } else if (isSuccess === 'error') {
      handleCancle();
    }
  };

  //render
  return (
    <div className={isShow ? style.active : style.unActive}>
      <div className={style.title}>
        <span className={style.titleContent}>{modaltitle}</span>
      </div>

      <div className={style.body}>
        <span>{modalContent}</span>
      </div>

      <div className={style.footer}>
        {
          isSuccess === 'success' ?
            <Button className={style.btn} onClick={singleBtn}>确认</Button> :
            isSuccess === 'error' ?
              <Button className={style.btn} onClick={singleBtn}>确认</Button> :
              (
                <div>
                  <Button className={style.btn} onClick={handleCancle}>取消</Button>
                  <Button className={style.btn} onClick={handleOK} type='primary'>确认</Button>
                </div>
              )
        }
      </div>
    </div>
  );
};


export default MyModal;

