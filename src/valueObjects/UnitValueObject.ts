export default class UnitValueObject {
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

  public getAlive(): boolean {
    return this.alive;
  }

  public setAlive(alive: boolean): UnitValueObject {
    return new UnitValueObject(alive, this.age);
  }
}
