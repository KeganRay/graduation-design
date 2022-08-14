// import React, { useContext, useRef, useState, createContext } from 'react';
// import MyModal from '../component/MyModal';
// import { Button } from 'antd';
// import style from './index.less';
// import Context from './context';
//
// const Index = () => {
//
//
//   // state
//   const [ModalShow, setModalShow] = useState(false);
//   const [count, setCount] = useState(0);
//
//   const ModalRef = useRef();
//
//   //按钮点击回调
//   const handleBtnClick = (event) => {
//     event.stopPropagation();
//     event.cancelBubble = true;//阻止冒泡
//     setModalShow(true);
//   };
//
//   const handleOK = () => {
//     setModalShow(false);
//   };
//
//   const handleCancle = () => {
//     setModalShow(false);
//   };
//
//   const handleSuccess = () => {
//     if (ModalRef && ModalRef.current && ModalRef.current.success) {
//       ModalRef.current.success({ title: '标题success', content: '这里是success框内容', onOK: handleOK, isSuccess: 'success' });
//     }
//   };
//
//   const handleError = () => {
//     if (ModalRef && ModalRef.current && ModalRef.current.error) {
//       ModalRef.current.error({ title: '标题error', content: '这里是error框内容', onCancel: handleCancle, isSuccess: 'error' });
//     }
//   };
//
//   //render
//   return (
//     <div>
//       {/*蒙层*/}
//       <div className={ModalShow ? style.hasMask : style.NotShow} onClick={handleCancle}></div>
//
//       <Button type='primary' onClick={handleBtnClick}>打开对话框</Button>
//       <Button onClick={handleSuccess}>success</Button>
//       <Button onClick={handleError}>error</Button>
//
//       <Context.Provider value={{niu:'22111',count}}>
//         <MyModal
//           isShow={ModalShow}
//           setIsShow={() => {
//             setModalShow(true);
//           }}
//           title={'标题'}
//           content={'这里是对话框内容'}
//           // handleOK={handleOK}
//           handleOK={() => {
//             setCount(count + 1);
//           }}
//           handleCancle={handleCancle}
//           ModalRef={ModalRef}
//         />
//       </Context.Provider>
//
//
//     </div>
//   );
// };
//
//
// export default Index;
import React, { Component } from 'react';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 0,
    };
  }

  componentDidMount() {
    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val);    // 第 1 次 log

    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val);  // 第 3 次 log

      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return (
      <div>
        {/*<button onClick={thi}>aaa</button>*/}
      </div>
    );
  }

}
export default Index
