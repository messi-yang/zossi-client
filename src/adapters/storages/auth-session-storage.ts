const singleton: AuthSessionStorage | null = null;

export class AuthSessionStorage {
  constructor(private webStorage: Storage) {}

  static get() {
    if (singleton) {
      return singleton;
    }
    return new AuthSessionStorage(globalThis.localStorage);
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
