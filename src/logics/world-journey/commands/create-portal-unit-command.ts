import { v4 as uuidv4 } from 'uuid';
import { UnitModel } from '@/models/world/unit-model';
import { Command, Options } from '../command';
import { PositionModel } from '@/models/world/position-model';
import { DirectionModel } from '@/models/world/direction-model';
import { DateModel } from '@/models/general/date-model';

export class CreatePortalUnitCommand implements Command {
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
    return new CreatePortalUnitCommand(uuidv4(), DateModel.now().getTimestampe(), itemId, position, direction);
  }

  static load(id: string, timestamp: number, itemId: string, position: PositionModel, direction: DirectionModel) {
    return new CreatePortalUnitCommand(id, timestamp, itemId, position, direction);
  }

  public execute({ unitStorage, itemStorage }: Options): boolean {
    const item = itemStorage.getItem(this.itemId);
    if (!item) return false;

    const unitAtPos = unitStorage.getUnit(this.position);
    if (unitAtPos) return false;

    return unitStorage.addUnit(UnitModel.new(this.itemId, this.position, this.direction));
  }

  public getId() {
    return this.id;
  }

  public getTimestampe() {
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
