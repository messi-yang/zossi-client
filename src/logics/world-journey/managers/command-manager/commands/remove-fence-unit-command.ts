import { v4 as uuidv4 } from 'uuid';
import { PositionVo } from '@/models/world/common/position-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/general/date-vo';

export class RemoveFenceUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionVo;

  constructor(id: string, timestamp: number, position: PositionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionVo) {
    return new RemoveFenceUnitCommand(uuidv4(), DateVo.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionVo) {
    return new RemoveFenceUnitCommand(id, timestamp, position);
  }

  public execute({ unitManager }: CommandParams): void {
    unitManager.removeUnit(this.position);
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
