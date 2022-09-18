export default class UnitVo {
  private alive: boolean;

  private age: number;

  constructor(alive: boolean, age: number) {
    this.alive = alive;
    this.age = age;
  }

  public isAlive(): boolean {
    return this.alive;
  }

  public getAge(): number {
    return this.age;
  }

  public setAlive(alive: boolean): void {
    this.alive = alive;
  }
}
