import { Command } from '../command';
import { CommandParams } from '../command-params';
import { PositionVo } from '@/models/world/common/position-vo';
import { DateVo } from '@/models/general/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RotateUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionVo;

  constructor(id: string, timestamp: number, position: PositionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionVo) {
    return new RotateUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionVo) {
    return new RotateUnitCommand(id, timestamp, position);
  }

  public execute({ unitManager }: CommandParams): void {
    const unit = unitManager.getUnit(this.position);
    if (!unit) return;

    const clonedUnit = unit.clone();
    clonedUnit.changeDirection(clonedUnit.getDirection().rotate());

    unitManager.updateUnit(clonedUnit);
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
