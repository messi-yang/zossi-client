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
    private unitId: string,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo
  ) {
    super(id, timestamp);
  }

  static new(itemId: string, position: PositionVo, direction: DirectionVo) {
    return new CreateFenceUnitCommand(
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
    return new CreateFenceUnitCommand(id, timestamp, unitId, itemId, position, direction);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Fence)) return;

    const unitAtPos = unitManager.getUnitByPos(this.position);
    if (unitAtPos) return;

    const playersAtPos = playerManager.getPlayersAtPos(this.position);
    if (playersAtPos) return;

    const newUnit = FenceUnitModel.new(this.unitId, this.itemId, this.position, this.direction, item.getDimension());

    unitManager.addUnit(newUnit);
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
