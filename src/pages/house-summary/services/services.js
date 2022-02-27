import axios from 'axios';

export async function sendtest(payload) {
  return axios.post(`/api/gethouse`, payload);
}

export async function createHouse(payload){
  return axios.post('/api/house/create-house',payload)
}
