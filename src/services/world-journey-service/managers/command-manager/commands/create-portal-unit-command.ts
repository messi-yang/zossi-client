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

    const unitAtPos = unitManager.getUnitByPos(this.position);
    if (unitAtPos) return;

    const playersAtPos = playerManager.getPlayersAtPos(this.position);
    if (playersAtPos) return;

    const newPortalUnit = PortalUnitModel.new(
      this.unitId,
      this.itemId,
      this.position,
      this.direction,
      item.getDimension(),
      null
    );

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
