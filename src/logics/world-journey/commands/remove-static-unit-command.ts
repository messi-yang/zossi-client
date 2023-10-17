import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from '@/models/world/common/position-model';
import { Command } from './command';
import { CommandParams } from './command-params';
import { DateModel } from '@/models/general/date-model';

export class RemoveStaticUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionModel;

  constructor(id: string, timestamp: number, position: PositionModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionModel) {
    return new RemoveStaticUnitCommand(uuidv4(), DateModel.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionModel) {
    return new RemoveStaticUnitCommand(id, timestamp, position);
  }

  public execute({ unitStorage }: CommandParams): void {
    unitStorage.removeUnit(this.position);
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