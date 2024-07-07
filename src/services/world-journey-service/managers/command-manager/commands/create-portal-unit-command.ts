import { DirectionVo } from '@/models/world/common/direction-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';

export class CreatePortalUnitCommand extends Command {
  constructor(
    id: string,
    createdAt: DateVo,
    isRemote: boolean,
    private unitId: string,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo
  ) {
    super(CommandNameEnum.CreatePortalUnit, id, createdAt, isRemote);
  }

  static create(itemId: string, position: PositionVo, direction: DirectionVo) {
    return new CreatePortalUnitCommand(generateUuidV4(), DateVo.now(), false, generateUuidV4(), itemId, position, direction);
  }

  static createRemote(id: string, createdAt: DateVo, unitId: string, itemId: string, position: PositionVo, direction: DirectionVo) {
    return new CreatePortalUnitCommand(id, createdAt, true, unitId, itemId, position, direction);
  }

  public getIsClientOnly = () => false;

  public getRequiredItemId = () => this.itemId;

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Portal)) return;

    const newUnit = PortalUnitModel.create(this.unitId, this.itemId, this.position, this.direction, item.getDimension(), null);

    const occupiedPositions = newUnit.getOccupiedPositions();
    for (let occupiedPositionIdx = 0; occupiedPositionIdx < occupiedPositions.length; occupiedPositionIdx += 1) {
      const occupiedPosition = occupiedPositions[occupiedPositionIdx];
      const unitAtPos = unitManager.getUnitByPos(occupiedPosition);
      if (unitAtPos) return;

      const playersAtPos = playerManager.getPlayersAtPos(occupiedPosition);
      if (playersAtPos) return;
    }

    const portalsWithoutTarget = unitManager.getPortalUnits().filter((unit) => !unit.getTargetUnitId());
    // const portalWithoutTarget = portalsWithoutTarget[0];

    const topLeftMostPortalWithoutTarget = portalsWithoutTarget
      .sort((unitA, unitB) => {
        const unitPosA = unitA.getPosition();
        const unitPosB = unitB.getPosition();

        if (unitPosA.getZ() === unitPosB.getZ()) {
          return unitPosA.getX() - unitPosB.getX();
        } else {
          return unitPosA.getZ() - unitPosB.getZ();
        }
      })
      .at(0);

    let isUnitAdded = false;
    let isTopLeftMostPortalWithoutTargetUpdated = false;
    if (topLeftMostPortalWithoutTarget) {
      newUnit.updateTargetUnitId(topLeftMostPortalWithoutTarget.getId());
      isUnitAdded = unitManager.addUnit(newUnit);

      const clonedTopLeftMostPortalWithoutTarget = topLeftMostPortalWithoutTarget.clone();
      clonedTopLeftMostPortalWithoutTarget.updateTargetUnitId(newUnit.getId());
      isTopLeftMostPortalWithoutTargetUpdated = unitManager.updateUnit(clonedTopLeftMostPortalWithoutTarget);
    } else {
      isUnitAdded = unitManager.addUnit(newUnit);
    }

    this.setUndoAction(() => {
      if (isUnitAdded) {
        unitManager.removeUnit(newUnit.getId());
      }

      if (topLeftMostPortalWithoutTarget && isTopLeftMostPortalWithoutTargetUpdated) {
        unitManager.updateUnit(topLeftMostPortalWithoutTarget);
      }
    });
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
