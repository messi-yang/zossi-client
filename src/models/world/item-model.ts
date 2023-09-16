import { v4 as uuidv4 } from 'uuid';
import { UnitTypeModel } from './unit-type-model';

export class ItemModel {
  constructor(
    private id: string,
    private name: string,
    private traversable: boolean,
    private thumbnailSrc: string,
    private modelSrc: string,
    private compatibleUnitType: UnitTypeModel
  ) {}

  static new = (
    id: string,
    name: string,
    traversable: boolean,
    thumbnailSrc: string,
    modelSrc: string,
    compatibleUnitType: UnitTypeModel
  ) => new ItemModel(id, name, traversable, thumbnailSrc, modelSrc, compatibleUnitType);

  static mockup(): ItemModel {
    return ItemModel.new(
      uuidv4(),
      'stone',
      true,
      '/placeholder-item.png',
      'characters/car.gltf',
      UnitTypeModel.new('static')
    );
  }

  public getCompatibleUnitType(): UnitTypeModel {
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
