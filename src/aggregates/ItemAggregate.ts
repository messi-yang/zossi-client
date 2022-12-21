export default class ItemAggregate {
  private id: string;

  private name: string;

  constructor(params: { id: string; name: string }) {
    this.id = params.id;
    this.name = params.name;
  }

  static newItemAggregate(params: { id: string; name: string }) {
    return new ItemAggregate(params);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
