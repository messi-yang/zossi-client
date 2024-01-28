import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

export class LinkUnitModel extends BaseUnitModel implements UnitModel {
  constructor(itemId: string, position: PositionVo, direction: DirectionVo, private url: string) {
    super(itemId, position, direction);
  }

  static new = (itemId: string, position: PositionVo, direction: DirectionVo, url: string): LinkUnitModel =>
    new LinkUnitModel(itemId, position, direction, url);

  static mockup(): LinkUnitModel {
    return new LinkUnitModel(generateUuidV4(), PositionVo.new(0, 0), DirectionVo.newDown(), 'https://www.google.com');
  }

  public clone(): LinkUnitModel {
    return new LinkUnitModel(this.getItemId(), this.getPosition(), this.getDirection(), this.url);
  }

  public getType(): UnitTypeEnum.Link {
    return UnitTypeEnum.Link;
  }

  public getUrl(): string {
    return this.url;
  }

  public updateUrl(url: string) {
    this.url = url;
  }
}
