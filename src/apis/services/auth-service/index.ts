export class AuthService {
  private url: string;

  constructor() {
    this.url = `${process.env.API_URL}/api/auth`;
  }

  static new(): AuthService {
    return new AuthService();
  }

  async goToGoogleOauthPage() {
    window.location.replace(`${this.url}/oauth2/google`);
  }
}
