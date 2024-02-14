import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';
import { LinkUnitModel } from '@/models/world/unit/link-unit-model';

export class CreateLinkUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  constructor(id: string, timestamp: number, private unit: LinkUnitModel, private url: string) {
    this.id = id;
    this.timestamp = timestamp;
  }

  static new(unit: LinkUnitModel, url: string) {
    return new CreateLinkUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unit, url);
  }

  static load(id: string, timestamp: number, unit: LinkUnitModel, url: string) {
    return new CreateLinkUnitCommand(id, timestamp, unit, url);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.unit.getItemId());
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Link)) return;

    const unitAtPos = unitManager.getUnitByPos(this.unit.getPosition());
    if (unitAtPos) return;

    const playersAtPos = playerManager.getPlayersAtPos(this.unit.getPosition());
    if (playersAtPos) return;

    unitManager.addUnit(this.unit);
  }

  public getId() {
    return this.id;
  }

  public getUnitId() {
    return this.unit.getId();
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getUnit() {
    return this.unit;
  }

  public getUrl() {
    return this.url;
  }
}
