import { AxiosResponse } from "axios";

import api from "@/app/shared/libs/api";

import { ISingUpRequest, IAuthResponse, ISingInRequest, IConfirmAccountResponse, IRequestResetPassworsResponse, IResetPasswordRequest, IAuthError } from "./auth.types";
import { authEndpoints } from "./auth.endpoints";

export const singUp = async (body: ISingUpRequest): Promise<AxiosResponse<IAuthResponse | IAuthError>> => {
  try {
    const response = await api.post(authEndpoints.registration, body);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const singIn = async (body: ISingInRequest): Promise<AxiosResponse<IAuthResponse | IAuthError>> => {
  try {
    const response = await api.post(authEndpoints.login, body);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmEmail = async (code: string): Promise<AxiosResponse<IConfirmAccountResponse>> => {
  try {
    const response = await api.post(authEndpoints.confirmMail, {
      params: { code }
    });

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const requestResetPassword = async (mail: string): Promise<AxiosResponse<IRequestResetPassworsResponse>> => {
  try {
    const response = await api.post(authEndpoints.resetPasswordRequest, { mail });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const resetPassword = async (body: IResetPasswordRequest): Promise<AxiosResponse<IAuthResponse>> => {
  try {
    const response = await api.post(authEndpoints.resetPasswordConfirm, body);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};