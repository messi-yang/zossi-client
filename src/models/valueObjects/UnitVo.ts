export default class UnitVo {
  private alive: boolean;

  constructor(alive: boolean) {
    this.alive = alive;
  }

  public isAlive(): boolean {
    return this.alive;
  }

  public getAlive(): boolean {
    return this.alive;
  }
}
