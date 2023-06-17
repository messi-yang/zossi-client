const singleton: LocalStorage | null = null;

export class LocalStorage {
  constructor(private webStorage: Storage) {}

  static get() {
    if (singleton) {
      return singleton;
    }
    return new LocalStorage(globalThis.localStorage);
  }

  getAccessToken(): string | null {
    return this.webStorage?.getItem('access_token') || null;
  }

  setAccessToken(accessToken: string) {
    return this.webStorage?.setItem('access_token', accessToken);
  }

  removeAccessToken() {
    this.webStorage.removeItem('access_token');
  }
}
