import { v4 as uuidv4 } from 'uuid';

export class ItemModel {
  constructor(
    private id: string,
    private name: string,
    private traversable: boolean,
    private thumbnailSrc: string,
    private modelSrc: string,
    private compatibleUnitType: 'static' | 'portal'
  ) {}

  static new = (
    id: string,
    name: string,
    traversable: boolean,
    thumbnailSrc: string,
    modelSrc: string,
    compatibleUnitType: 'static' | 'portal'
  ) => new ItemModel(id, name, traversable, thumbnailSrc, modelSrc, compatibleUnitType);

  static mockup(): ItemModel {
    return ItemModel.new(uuidv4(), 'stone', true, '/placeholder-item.png', 'characters/car.gltf', 'static');
  }

  public getCompatibleUnitType(): 'static' | 'portal' {
    return this.compatibleUnitType;
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
