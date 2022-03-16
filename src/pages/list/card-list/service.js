import axios from 'axios';

//查询房源列表
export async function queryHouseList(userId){
  return axios.get(`/api/house/queryUserHouseList?userId=${userId}`);
}

//删除房源
export async function delHouse(param){
  return axios.post(`/api/house/del-house`,param);
}

//租客根据账号查询房子
export async function tenantFindHouseByAccount(payload) {
  return axios.get(`/api/house/tenantFindHouseByAccount?account=${payload}`);
}
