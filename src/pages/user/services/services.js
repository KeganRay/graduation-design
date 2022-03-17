import axios from 'axios';

//用户登录
export async function login(payload) {
  return axios.post(`/api/user/login`, payload);
}

//用户注册
export async function registeuser(payload) {
  return axios.post(`/api/user/register`, payload);
}

//租客根据账号查询房子
export async function tenantFindHouseByAccount(payload) {
  return axios.get(`/api/house/tenantFindHouseByAccount?account=${payload}`);
}
