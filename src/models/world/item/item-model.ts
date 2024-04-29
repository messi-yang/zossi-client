import { DimensionVo } from '../common/dimension-vo';
import { UnitTypeEnum } from '../unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class ItemModel {
  constructor(
    private id: string,
    private name: string,
    private dimension: DimensionVo,
    private traversable: boolean,
    private thumbnailSrc: string,
    private modelSources: string[],
    private compatibleUnitType: UnitTypeEnum
  ) {}

  static create = (
    id: string,
    name: string,
    dimension: DimensionVo,
    traversable: boolean,
    thumbnailSrc: string,
    modelSources: string[],
    compatibleUnitType: UnitTypeEnum
  ) => new ItemModel(id, name, dimension, traversable, thumbnailSrc, modelSources, compatibleUnitType);

  static createMock(): ItemModel {
    return ItemModel.create(
      generateUuidV4(),
      'stone',
      DimensionVo.create(1, 1),
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

  public getDimension(): DimensionVo {
    return this.dimension;
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
