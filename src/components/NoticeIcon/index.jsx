import { useEffect, useState, React } from 'react';
import { message } from 'antd';
import { groupBy } from 'lodash';
import { useModel } from 'umi';
import * as services from './services/services';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';

//获取所有通知
const getNoticeData = (notices) => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {};
  }
  console.log('通知：', notices);
  const newNotices = notices.map((notice) => {
    if (notice.isRead === true) {
      notice.read = true;
    }
    const newNotice = { ...notice };

    return newNotice;
  });
  return groupBy(newNotices, 'noticeType');//根据noticeType字段进行分类，以数组类型进行分类
};

//过滤未读的类型消息的个数
const getUnreadData = (noticeData) => {
  const unreadMsg = {};
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key];//message

    if (!unreadMsg[key]) {//如果不存在就进来
      unreadMsg[key] = 0;
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => item.isRead === false).length;
    }
  });

  return unreadMsg;
};

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useState([]);//所有类型的通知
  const [unreadMsg, setunreadMsg] = useState([]);//所有类型的通知
  const [unreadNum,setUnreadNum] = useState(0)

  //componentdidmount
  useEffect(() => {
    initNotices();
  }, []);

  const initNotices = () => {
    return new Promise((resolve => {
      services.getNotices(currentUser?.userId || '').then((res) => {
        if (res && res.data.code === 0) {
          const notices = res.data.data;
          const noticeData = getNoticeData(notices);//此时noticeData是一个有类型分类的数组
          console.log(noticeData);
          const unreadMsg = getUnreadData(noticeData || {});//根据是否已读进行分类
          console.log(1111111,unreadMsg);
          handleUnreadNum(unreadMsg)
          setNotices(noticeData || []);
          setunreadMsg(unreadMsg || []);

          resolve({ code: 0 });
        } else {
          resolve({ code: -1 });
        }
      });
    }));

  };

  /**
   * @Description:刷新通知
   * @date 2022--23-11
   */
  const handleRefresh = () => {
    const key = 'refreshNotices';
    message.loading({ content: '加载中...', key });
    initNotices().then((res) => {
      if (res && res.code === 0) {
        message.success({ content: '刷新成功', key, duration: 2 });
      } else if (res && res.code === -1) {
        message.error({ context: '刷新失败', key, duration: 2 });
      }
    });
  };

  /**
   * @Description:调用接口更改通知状态
   * @date 2022--38-11
   */
  const changeReadState = (noticeId) => {
    const param = { noticeId, userId: initialState.userId };
    services.handleReadNotice(param).then((res) => {

    });
  };

  const clearReadState = (title, key) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };

        if (notice.type === key) {
          notice.read = true;
        }

        return notice;
      }),
    );
    message.success(`${'清空了'} ${title}`);
  };

  //设置未读个数
  const handleUnreadNum = (unreadMsg) => {
    console.log(unreadMsg);
    let Num = 0;
    Object.keys(unreadMsg).forEach((item) => {
      Num += unreadMsg[item];
    });
    console.log('数字：',Num);
    setUnreadNum(Num)
  };


  return (
    <NoticeIcon
      className={styles.action}
      count={unreadNum||""}
      onItemClick={(item) => {
        changeReadState(item.noticeId);
      }}
      onClear={(title, key) => clearReadState(title, key)}
      loading={false}
      clearText='清空'
      viewMoreText='刷新'
      onViewMore={handleRefresh}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey='messageTab'
        count={unreadMsg.message}
        list={notices.message}
        title='消息通知'
        emptyText='你已查看所有通知'
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey='feeChargeTab'
        count={unreadMsg.feeCharge}
        list={notices.feeCharge}
        title='费用通知'
        emptyText='您已读完所有公告'
        showViewMore
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
