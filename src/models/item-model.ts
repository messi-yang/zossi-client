import { v4 as uuidv4 } from 'uuid';

export class ItemModel {
  constructor(
    private id: string,
    private name: string,
    private traversable: boolean,
    private thumbnailSrc: string,
    private modelSrc: string
  ) {}

  static new = (id: string, name: string, traversable: boolean, thumbnailSrc: string, modelSrc: string) =>
    new ItemModel(id, name, traversable, thumbnailSrc, modelSrc);

  static mockup(): ItemModel {
    return ItemModel.new(uuidv4(), 'stone', true, '/placeholder-item.png', 'characters/car.gltf');
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getTraversable(): boolean {
    return this.traversable;
  }

  public getThumbnailSrc(): string {
    return this.thumbnailSrc;
  }

  public getModelSrc(): string {
    return this.modelSrc;
  }
}
