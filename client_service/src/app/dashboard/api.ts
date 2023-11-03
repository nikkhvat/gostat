
import api from '@/app/utils/axiosInstance'
import { AxiosResponse } from 'axios';

import { IUserData, Stat } from './index';

export const getStat = async (id: string): Promise<AxiosResponse<Stat>> => {    
  try {
    const response = await api.get(`/api/stats/visits`, {
      params: {
        app: id
      }
    });
    return response
  } catch (error) {
    console.log('Error fetching data:', error);
    return Promise.reject(error);
  }
}

export const getUserData = async (): Promise<AxiosResponse<IUserData>> => {
  try {
    const response = await api.get('/api/auth/info');
    return response
  } catch (error) {
    console.log('Error fetching data:', error);
    return Promise.reject(error);
  }
}