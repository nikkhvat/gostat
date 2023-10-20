import api from '@/app/utils/axiosInstance'
import { AxiosResponse } from 'axios';
import {ISingUpRequest, ISingUpResponse} from './index';

export const singUp = async (body: ISingUpRequest): Promise<AxiosResponse<ISingUpResponse>> => {    
  try {
    const response = await api.post('/api/auth/registration', body);
    return response
  } catch (error) {
    console.log('Error fetching data:', error);
    return Promise.reject(error);
  }
}