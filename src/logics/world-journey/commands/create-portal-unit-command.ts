import { v4 as uuidv4 } from 'uuid';
import { Command } from './command';
import { CommandParams } from './command-params';
import { PositionModel } from '@/models/world/common/position-model';
import { DirectionModel } from '@/models/world/common/direction-model';
import { DateModel } from '@/models/general/date-model';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';

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
    return new CreatePortalUnitCommand(uuidv4(), DateModel.now().getTimestamp(), itemId, position, direction);
  }

  static load(id: string, timestamp: number, itemId: string, position: PositionModel, direction: DirectionModel) {
    return new CreatePortalUnitCommand(id, timestamp, itemId, position, direction);
  }

  public execute({ unitStorage, playerStorage, itemStorage }: CommandParams): void {
    const item = itemStorage.getItem(this.itemId);
    if (!item) return;

    if (!item.getCompatibleUnitType().isPortal()) return;

    const unitAtPos = unitStorage.getUnit(this.position);
    if (unitAtPos) return;

    const playersAtPos = playerStorage.getPlayersAtPos(this.position);
    if (playersAtPos) return;

    const newPortalUnit = PortalUnitModel.new(this.itemId, this.position, this.direction, null);

    const portalsWithoutTarget = unitStorage.getPortalUnits().filter((unit) => !unit.getTargetPosition());
    if (portalsWithoutTarget.length === 0) {
      unitStorage.addUnit(newPortalUnit);
    } else {
      const topLeftMostPortalWithoutTarget = portalsWithoutTarget.sort((unitA, unitB) => {
        const unitPosA = unitA.getPosition();
        const unitPosB = unitB.getPosition();

        if (unitPosA.getZ() === unitPosB.getZ()) {
          return unitPosA.getX() - unitPosB.getX();
        } else {
          return unitPosA.getZ() - unitPosB.getZ();
        }
      })[0];

      topLeftMostPortalWithoutTarget.updateTargetPosition(newPortalUnit.getPosition());
      unitStorage.updateUnit(topLeftMostPortalWithoutTarget);

      newPortalUnit.updateTargetPosition(topLeftMostPortalWithoutTarget.getPosition());
      unitStorage.addUnit(newPortalUnit);
    }
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
