import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { EmbedUnitModel } from '@/models/world/unit/embed-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class CreateEmbedUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  constructor(id: string, timestamp: number, private unit: EmbedUnitModel, private embedCode: string) {
    this.id = id;
    this.timestamp = timestamp;
  }

  static new(unit: EmbedUnitModel, embedCode: string) {
    return new CreateEmbedUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unit, embedCode);
  }

  static load(id: string, timestamp: number, unit: EmbedUnitModel, embedCode: string) {
    return new CreateEmbedUnitCommand(id, timestamp, unit, embedCode);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.unit.getItemId());
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Embed)) return;

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

  public getEmbedCode() {
    return this.embedCode;
  }
}
