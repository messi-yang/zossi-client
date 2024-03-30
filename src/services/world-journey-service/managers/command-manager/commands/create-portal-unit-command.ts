import { DirectionVo } from '@/models/world/common/direction-vo';
import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class CreatePortalUnitCommand extends BaseCommand {
  constructor(
    id: string,
    timestamp: number,
    private unitId: string,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo
  ) {
    super(id, timestamp);
  }

  static new(itemId: string, position: PositionVo, direction: DirectionVo) {
    return new CreatePortalUnitCommand(
      generateUuidV4(),
      DateVo.now().getTimestamp(),
      generateUuidV4(),
      itemId,
      position,
      direction
    );
  }

  static load(
    id: string,
    timestamp: number,
    unitId: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo
  ) {
    return new CreatePortalUnitCommand(id, timestamp, unitId, itemId, position, direction);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Portal)) return;

    const newUnit = PortalUnitModel.new(
      this.unitId,
      this.itemId,
      this.position,
      this.direction,
      item.getDimension(),
      null
    );

    const occupiedPositions = newUnit.getOccupiedPositions();
    for (let occupiedPositionIdx = 0; occupiedPositionIdx < occupiedPositions.length; occupiedPositionIdx += 1) {
      const occupiedPosition = occupiedPositions[occupiedPositionIdx];
      const unitAtPos = unitManager.getUnitByPos(occupiedPosition);
      if (unitAtPos) return;

      const playersAtPos = playerManager.getPlayersAtPos(occupiedPosition);
      if (playersAtPos) return;
    }

    const portalsWithoutTarget = unitManager.getPortalUnits().filter((unit) => !unit.getTargetUnitId());
    if (portalsWithoutTarget.length === 0) {
      unitManager.addUnit(newUnit);
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

      topLeftMostPortalWithoutTarget.updateTargetUnitId(newUnit.getId());
      unitManager.updateUnit(topLeftMostPortalWithoutTarget);

      newUnit.updateTargetUnitId(topLeftMostPortalWithoutTarget.getId());
      unitManager.addUnit(newUnit);
    }
  }

  public getUnitId() {
    return this.unitId;
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
