import axios, { Axios } from 'axios';
import { LocalStorage } from '@/storages/local-storage';
import { EventMediator, eventFactory } from '@/events';

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
    newAxios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const localStorage = LocalStorage.get();
          localStorage.removeAccessToken();

          const eventMediator = EventMediator.new();
          eventMediator.publish(eventFactory.newApiUnauthorizedEvent());
        }
        return Promise.reject(error);
      }
    );
    return newAxios;
  }
}
