import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from '@/models/world/common/position-model';
import { Command } from './command';
import { CommandParams } from './command-params';
import { DateModel } from '@/models/general/date-model';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';

export class RemovePortalUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionModel;

  constructor(id: string, timestamp: number, position: PositionModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionModel) {
    return new RemovePortalUnitCommand(uuidv4(), DateModel.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionModel) {
    return new RemovePortalUnitCommand(id, timestamp, position);
  }

  public execute({ unitStorage }: CommandParams): void {
    const portalUnit = unitStorage.getUnit(this.position);
    if (!portalUnit) return;

    if (!(portalUnit instanceof PortalUnitModel)) return;

    const targetPos = portalUnit.getTargetPosition();
    if (targetPos) {
      const targetPortalUnit = unitStorage.getUnit(targetPos);
      if (targetPortalUnit && targetPortalUnit instanceof PortalUnitModel) {
        targetPortalUnit.updateTargetPosition(null);
        unitStorage.updateUnit(targetPortalUnit);
      }
    }

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
