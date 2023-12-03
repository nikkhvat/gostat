import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

import Storage from "@/app/shared/libs/storage";

interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
});

api.interceptors.request.use((config) => {
  const token = Storage.get("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error: AxiosError) => Promise.reject(error));

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.config?.url?.includes("api/auth") && !error.config?.url?.includes("info")) {
      return Promise.reject(error);
    }

    if (error.config === undefined) {
      return Promise.reject(error);
    }

    const originalRequest: CustomConfig = error.config;

    if (error.response?.status === 401 && originalRequest._retry != true) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/refresh`);
        Storage.set("access_token", refreshResponse.data.access_token);
      } catch {}

      if (error.config) {
        return api.request(error.config);
      }
    } else if (originalRequest._retry === true && error.response?.status === 401) {
      Storage.delete("access_token");

      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

export default api;
