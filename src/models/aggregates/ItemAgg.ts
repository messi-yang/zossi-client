export default class ItemAgg {
  private id: string;

  private name: string;

  constructor(params: { id: string; name: string }) {
    this.id = params.id;
    this.name = params.name;
  }

  static newItemAgg(params: { id: string; name: string }) {
    return new ItemAgg(params);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
