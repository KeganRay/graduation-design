import axios from 'axios';

//查询房源列表
export async function queryHouseList(userId){
  return axios.get(`/api/house/queryUserHouseList?userId=${userId}`);
}

//删除房源
export async function delHouse(param){
  return axios.post(`/api/house/del-house`,param);
}
