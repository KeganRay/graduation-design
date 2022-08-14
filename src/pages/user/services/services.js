import axios from 'axios';
import { request } from 'umi';

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

//查询所有用户
export async function queryAllUsers() {
  return axios.get(`/api/user/query-all-users`);
}

//删除指定用户
export async function delUser(payload) {
  return axios.post(`/api/user/delete-user`,payload);
}
