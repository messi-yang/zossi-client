import axios, { Axios } from 'axios';

export class AxiosProvider {
  static newAxiosInstance(baseURL: string): Axios {
    const newAxios = axios.create({
      baseURL,
    });
    newAxios.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    });
    return newAxios;
  }
}
