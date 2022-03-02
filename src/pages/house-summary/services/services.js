import axios from 'axios';

export async function sendtest(payload) {
  return axios.post(`/api/gethouse`, payload);
}
//创建房子
export async function createHouse(payload){
  return axios.post('/api/house/create-house',payload)
}
//通过房屋ID查询房子数据
export async function queryByhouseId(payload){
  return axios.get(`/api/house/query-by-houseId?houseId=${payload}`)
}
// 通过身份证查询用户信息
export async function queryByIdCardNumber(payload){
  return axios.get(`/api/user/query-by-idCardNmber?IDcardNumber=${payload}`)
}
