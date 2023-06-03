import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  constructor(private id: string, private emailAddress: string, private username: string) {}

  static new = (id: string, emailAddress: string, username: string): UserModel =>
    new UserModel(id, emailAddress, username);

  static newMockupWorld = (): UserModel => new UserModel(uuidv4(), 'Hello World', uuidv4());

  public getId(): string {
    return this.id;
  }

  public getEmailAddress(): string {
    return this.emailAddress;
  }

  public getUsername(): string {
    return this.username;
  }
}
