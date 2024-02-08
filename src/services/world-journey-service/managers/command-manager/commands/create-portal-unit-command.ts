import { Command } from '../command';
import { CommandParams } from '../command-params';
import { PositionVo } from '@/models/world/common/position-vo';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { DateVo } from '@/models/global/date-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class CreatePortalUnitCommand implements Command {
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
    return new CreatePortalUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), itemId, position, direction);
  }

  static load(id: string, timestamp: number, itemId: string, position: PositionVo, direction: DirectionVo) {
    return new CreatePortalUnitCommand(id, timestamp, itemId, position, direction);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Portal)) return;

    const unitAtPos = unitManager.getUnit(this.position);
    if (unitAtPos) return;

    const playersAtPos = playerManager.getPlayersAtPos(this.position);
    if (playersAtPos) return;

    const newPortalUnit = PortalUnitModel.new(this.itemId, this.position, this.direction, null);

    const portalsWithoutTarget = unitManager.getPortalUnits().filter((unit) => !unit.getTargetPosition());
    if (portalsWithoutTarget.length === 0) {
      unitManager.addUnit(newPortalUnit);
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
      unitManager.updateUnit(topLeftMostPortalWithoutTarget);

      newPortalUnit.updateTargetPosition(topLeftMostPortalWithoutTarget.getPosition());
      unitManager.addUnit(newPortalUnit);
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
