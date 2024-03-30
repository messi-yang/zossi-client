import { DirectionVo } from '@/models/world/common/direction-vo';
import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { EmbedUnitModel } from '@/models/world/unit/embed-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class CreateEmbedUnitCommand extends BaseCommand {
  constructor(
    id: string,
    timestamp: number,
    private unitId: string,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo,
    private label: string | null,
    private embedCode: string
  ) {
    super(id, timestamp);
  }

  static new(itemId: string, position: PositionVo, direction: DirectionVo, label: string | null, embedCode: string) {
    return new CreateEmbedUnitCommand(
      generateUuidV4(),
      DateVo.now().getTimestamp(),
      generateUuidV4(),
      itemId,
      position,
      direction,
      label,
      embedCode
    );
  }

  static load(
    id: string,
    timestamp: number,
    unitId: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    label: string | null,
    embedCode: string
  ) {
    return new CreateEmbedUnitCommand(id, timestamp, unitId, itemId, position, direction, label, embedCode);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Embed)) return;

    const newUnit = EmbedUnitModel.new(
      this.unitId,
      this.itemId,
      this.position,
      this.direction,
      item.getDimension(),
      this.label
    );

    const occupiedPositions = newUnit.getOccupiedPositions();
    for (let occupiedPositionIdx = 0; occupiedPositionIdx < occupiedPositions.length; occupiedPositionIdx += 1) {
      const occupiedPosition = occupiedPositions[occupiedPositionIdx];
      const unitAtPos = unitManager.getUnitByPos(occupiedPosition);
      if (unitAtPos) return;

      const playersAtPos = playerManager.getPlayersAtPos(occupiedPosition);
      if (playersAtPos) return;
    }

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

  public getLabel() {
    return this.label;
  }

  public getEmbedCode() {
    return this.embedCode;
  }
}
