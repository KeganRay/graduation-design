import axios from 'axios';

//用户登录
export async function login(payload) {
  console.log(payload);
  return axios.post(`/api/user/login`, payload);
}

//用户注册
export async function registeuser(payload) {
  console.log(payload);
  return axios.post(`/api/user/register`, payload);
}
