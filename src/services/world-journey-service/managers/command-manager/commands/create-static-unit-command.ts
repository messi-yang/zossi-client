import { Command } from '../command';
import { CommandParams } from '../command-params';
import { PositionVo } from '@/models/world/common/position-vo';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { DateVo } from '@/models/general/date-vo';
import { StaticUnitModel } from '@/models/world/unit/static-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class CreateStaticUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private itemId: string;

  private position: PositionVo;

  private direction: DirectionVo;

  constructor(id: string, timestamp: number, itemId: string, position: PositionVo, direction: DirectionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.itemId = itemId;
    this.position = position;
    this.direction = direction;
  }

  static new(itemId: string, position: PositionVo, direction: DirectionVo) {
    return new CreateStaticUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), itemId, position, direction);
  }

  static load(id: string, timestamp: number, itemId: string, position: PositionVo, direction: DirectionVo) {
    return new CreateStaticUnitCommand(id, timestamp, itemId, position, direction);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Static)) return;

    const unitAtPos = unitManager.getUnit(this.position);
    if (unitAtPos) return;

    const playersAtPos = playerManager.getPlayersAtPos(this.position);
    if (playersAtPos) return;

    unitManager.addUnit(StaticUnitModel.new(this.itemId, this.position, this.direction));
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getItemId() {
    return this.itemId;
  }

  public getPosition() {
    return this.position;
  }

  public getDirection() {
    return this.direction;
  }
}
