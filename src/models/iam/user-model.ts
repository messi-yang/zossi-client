import { generateUuidV4 } from '@/utils/uuid';

export class UserModel {
  constructor(private id: string, private emailAddress: string, private username: string, private friendlyName: string) {}

  static create = (id: string, emailAddress: string, username: string, friendlyName: string): UserModel =>
    new UserModel(id, emailAddress, username, friendlyName);

  static createMock = (): UserModel => new UserModel(generateUuidV4(), 'example@gmail.com', 'my_username', 'My Friendly Name');

  public clone(): UserModel {
    return new UserModel(this.id, this.emailAddress, this.username, this.friendlyName);
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

  public getFriendlyName(): string {
    return this.friendlyName;
  }

  public setFriendlyName(newFriendlyName: string): void {
    this.friendlyName = newFriendlyName;
  }

  public getInitials(): string {
    return this.username.charAt(0).toUpperCase();
  }
}
