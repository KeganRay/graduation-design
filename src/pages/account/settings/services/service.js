import axios from 'axios';

//根据用户Id更新用户信息
export async function updateUserInfo(payload) {
  return axios.post(`/api/user/updateUserInfo`,payload);
}
