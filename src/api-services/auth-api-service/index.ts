export class AuthApiService {
  private url: string;

  constructor() {
    this.url = `${process.env.API_URL}/api/auth`;
  }

  static new(): AuthApiService {
    return new AuthApiService();
  }

  async startGoogleOauthFlow(oauthClientRedirectPath: string) {
    window.location.replace(`${this.url}/oauth2/google?client_redirect_path=${oauthClientRedirectPath}`);
  }
}
