import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from '@/models/world/position-model';
import { Command } from './command';
import { CommandParams } from './command-params';
import { DateModel } from '@/models/general/date-model';

export class RemoveUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionModel;

  constructor(id: string, timestamp: number, position: PositionModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionModel) {
    return new RemoveUnitCommand(uuidv4(), DateModel.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionModel) {
    return new RemoveUnitCommand(id, timestamp, position);
  }

  public execute({ unitStorage }: CommandParams) {
    return unitStorage.removeUnit(this.position);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPosition() {
    return this.position;
  }
}
