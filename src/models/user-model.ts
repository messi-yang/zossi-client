import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  constructor(private id: string, private emailAddress: string, private username: string) {}

  static new = (id: string, emailAddress: string, username: string): UserModel =>
    new UserModel(id, emailAddress, username);

  static newMockupUser = (): UserModel => new UserModel(uuidv4(), 'example@gmail.com', 'my_username');

  public clone(): UserModel {
    return new UserModel(this.id, this.emailAddress, this.username);
  }

  public getId(): string {
    return this.id;
  }

  public getEmailAddress(): string {
    return this.emailAddress;
  }

  public getUsername(): string {
    return this.username;
  }

  public setUsername(newUsername: string): void {
    this.username = newUsername;
  }

  public getInitials(): string {
    return this.username.charAt(0).toUpperCase();
  }
}
