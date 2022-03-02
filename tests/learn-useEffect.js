import {useEffect} from 'react';

function Demo(){
  //todo 相当于didmount 和 didupdate 以及 willunmount
  /*可以传两个参数，第一个是函数，第二个是数组（包含监听目标）
    如果第一个参数（函数）返回一个函数，这个函数就是componentwillunmount
    如果第二个监听目标的数组为  空数组  相当于谁都不监测 相当于componentdidmount
    如果第二个参数直接不写表示所有人都检测 相当于componentdidupdate

  * */
  useEffect(()=>{

  })
}

// git commit -m “提交页面备注” --no-verify 忽略代码风格检查
