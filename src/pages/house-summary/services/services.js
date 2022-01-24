import { config } from '../../../common/config';
import axios from 'axios';

export async function sendtest(payload) {
  return axios.post(`/api/getuser`, payload);
}
