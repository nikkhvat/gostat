import api from '@/app/shared/libs/api'

import { AxiosResponse } from 'axios';
import { ISingUpRequest, IAuthResponse, ISingInRequest, IConfirmAccountResponse, IRequestResetPassworsResponse, IResetPasswordRequest } from './index';

export const singUp = async (body: ISingUpRequest): Promise<AxiosResponse<IAuthResponse>> => {    
  try {
    const response = await api.post('/api/auth/registration', body);
    return response
  } catch (error) {
    console.log('Error fetching data:', error);
    return Promise.reject(error);
  }
}

export const singIn = async (body: ISingInRequest): Promise<AxiosResponse<IAuthResponse>> => {
  try {
    const response = await api.post('/api/auth/login', body);
    return response
  } catch (error) {
    console.log('Error fetching data:', error);
    return Promise.reject(error);
  }
}

export const confirmEmail = async (code: string): Promise<AxiosResponse<IConfirmAccountResponse>> => {
  try {
    const response = await api.post('/api/auth/confirm/mail', {
      params: {code}
    })
    return response
  } catch (error) {
    console.log('Error fetching data:', error);
    return Promise.reject(error);
  }
}

export const requestResetPassword = async (mail: string): Promise<AxiosResponse<IRequestResetPassworsResponse>> => {
  try {
    const response = await api.post('/api/auth/password/request', { mail })
    return response
  } catch (error) {
    console.log('Error fetching data:', error);
    return Promise.reject(error);
  }
}

export const resetPassword = async (body: IResetPasswordRequest): Promise<AxiosResponse<IAuthResponse>> => {
  try {
    const response = await api.post('/api/auth/password/reset', body)
    return response
  } catch (error) {
    console.log('Error fetching data:', error);
    return Promise.reject(error);
  }
}