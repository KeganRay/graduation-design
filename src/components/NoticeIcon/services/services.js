import axios from 'axios';

//根据用户Id获取消息通知
export async function getNotices(payload) {
  return axios.get(`/api/user/getNotices?userId=${payload}`);
}

//根据消息Id设为已读
export async function handleReadNotice(payload) {
  return axios.post(`/api/user/handle-read-notice`,payload);
}
