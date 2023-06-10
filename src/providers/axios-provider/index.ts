import axios, { Axios } from 'axios';
import { LocalStorage } from '@/storages/local-storage';

export class AxiosProvider {
  static new(baseURL: string): Axios {
    const newAxios = axios.create({
      baseURL,
    });
    newAxios.interceptors.request.use((config) => {
      const localStorage = LocalStorage.get();
      const accessToken = localStorage.getAccessToken();
      config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
      return config;
    });
    return newAxios;
  }
}
