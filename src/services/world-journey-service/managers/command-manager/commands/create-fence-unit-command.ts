import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { FenceUnitModel } from '@/models/world/unit/fence-unit-model';
import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { PositionVo } from '@/models/world/common/position-vo';

export class CreateFenceUnitCommand extends BaseCommand {
  constructor(
    id: string,
    timestamp: number,
    isRemote: boolean,
    private unitId: string,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo
  ) {
    super(id, timestamp, isRemote);
  }

  static create(itemId: string, position: PositionVo, direction: DirectionVo) {
    return new CreateFenceUnitCommand(
      generateUuidV4(),
      DateVo.now().getTimestamp(),
      false,
      generateUuidV4(),
      itemId,
      position,
      direction
    );
  }

  static createRemote(
    id: string,
    timestamp: number,
    unitId: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo
  ) {
    return new CreateFenceUnitCommand(id, timestamp, true, unitId, itemId, position, direction);
  }

  public getIsClientOnly = () => false;

  public getIsReplayable = () => true;

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Fence)) return;

    const newUnit = FenceUnitModel.create(this.unitId, this.itemId, this.position, this.direction, item.getDimension());

    const occupiedPositions = newUnit.getOccupiedPositions();
    for (let occupiedPositionIdx = 0; occupiedPositionIdx < occupiedPositions.length; occupiedPositionIdx += 1) {
      const occupiedPosition = occupiedPositions[occupiedPositionIdx];
      const unitAtPos = unitManager.getUnitByPos(occupiedPosition);
      if (unitAtPos) return;

      const playersAtPos = playerManager.getPlayersAtPos(occupiedPosition);
      if (playersAtPos) return;
    }

    const newUnitAdded = unitManager.addUnit(newUnit);

    this.setUndoAction(() => {
      if (newUnitAdded) {
        unitManager.removeUnit(newUnit.getId());
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
