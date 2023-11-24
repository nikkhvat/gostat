import axios, { AxiosResponse, AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
});

api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('gostat_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest:any = error.config;

    if (error.response?.status === 401 && originalRequest._retry != true) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post('/api/auth/refresh');
        const newAccessToken = refreshResponse.data.access_token;
        localStorage.setItem('gostat_access_token', newAccessToken);
      } catch {

      }

      if (error.config) {
        return api.request(error.config);
      }
    } else if (originalRequest._retry === true && error.response?.status === 401) {
      localStorage.removeItem('gostat_access_token');

      window.location.href = '/en/auth';
    }

    return Promise.reject(error);
  }
);

export default api;
