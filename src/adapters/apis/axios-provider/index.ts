import axios, { Axios } from 'axios';
import { AuthSessionStorage } from '@/adapters/storages/auth-session-storage';
import { EventMediator, eventFactory } from '@/events';

export class AxiosProvider {
  static new(baseURL: string): Axios {
    const newAxios = axios.create({
      baseURL,
    });
    newAxios.interceptors.request.use((config) => {
      const authSessionStorage = AuthSessionStorage.get();
      const accessToken = authSessionStorage.getAccessToken();
      config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
      return config;
    });
    newAxios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const authSessionStorage = AuthSessionStorage.get();
          authSessionStorage.removeAccessToken();

          const eventMediator = EventMediator.new();
          eventMediator.publish(eventFactory.newApiUnauthorizedEvent());
        }
        return Promise.reject(error);
      }
    );
    return newAxios;
  }
}
