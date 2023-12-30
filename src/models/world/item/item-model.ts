import { v4 as uuidv4 } from 'uuid';
import { UnitTypeEnum } from '../unit/unit-type-enum';

export class ItemModel {
  constructor(
    private id: string,
    private name: string,
    private traversable: boolean,
    private thumbnailSrc: string,
    private modelSources: string[],
    private compatibleUnitType: UnitTypeEnum
  ) {}

  static new = (
    id: string,
    name: string,
    traversable: boolean,
    thumbnailSrc: string,
    modelSources: string[],
    compatibleUnitType: UnitTypeEnum
  ) => new ItemModel(id, name, traversable, thumbnailSrc, modelSources, compatibleUnitType);

  static mockup(): ItemModel {
    return ItemModel.new(
      uuidv4(),
      'stone',
      true,
      '/placeholder-item.png',
      ['characters/car.gltf'],
      UnitTypeEnum.Static
    );
  }

  public getCompatibleUnitType(): UnitTypeEnum {
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

  public getModelSources(): string[] {
    return this.modelSources;
  }
}
