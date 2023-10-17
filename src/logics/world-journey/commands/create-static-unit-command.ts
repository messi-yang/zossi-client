import { v4 as uuidv4 } from 'uuid';
import { Command } from './command';
import { CommandParams } from './command-params';
import { PositionModel } from '@/models/world/common/position-model';
import { DirectionModel } from '@/models/world/common/direction-model';
import { DateModel } from '@/models/general/date-model';
import { StaticUnitModel } from '@/models/world/unit/static-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';

export class CreateStaticUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private itemId: string;

  private position: PositionModel;

  private direction: DirectionModel;

  constructor(id: string, timestamp: number, itemId: string, position: PositionModel, direction: DirectionModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.itemId = itemId;
    this.position = position;
    this.direction = direction;
  }

  static new(itemId: string, position: PositionModel, direction: DirectionModel) {
    return new CreateStaticUnitCommand(uuidv4(), DateModel.now().getTimestamp(), itemId, position, direction);
  }

  static load(id: string, timestamp: number, itemId: string, position: PositionModel, direction: DirectionModel) {
    return new CreateStaticUnitCommand(id, timestamp, itemId, position, direction);
  }

  public execute({ unitStorage, playerStorage, itemStorage }: CommandParams): void {
    const item = itemStorage.getItem(this.itemId);
    if (!item) return;

    if (item.getCompatibleUnitType() !== UnitTypeEnum.Static) return;

    const unitAtPos = unitStorage.getUnit(this.position);
    if (unitAtPos) return;

    const playersAtPos = playerStorage.getPlayersAtPos(this.position);
    if (playersAtPos) return;

    unitStorage.addUnit(StaticUnitModel.new(this.itemId, this.position, this.direction));
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
