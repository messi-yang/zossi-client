import { DirectionVo } from '@/models/world/common/direction-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';
import { UnitModel } from '@/models/world/unit/unit-model';
import { DimensionVo } from '@/models/world/common/dimension-vo';

export class CreateEmbedUnitCommand extends Command {
  constructor(
    id: string,
    createdAt: DateVo,
    isRemote: boolean,
    private unitId: string,
    private itemId: string,
    private itemCompatibleUnitType: UnitTypeEnum,
    private itemDimension: DimensionVo,
    private unitPosition: PositionVo,
    private unitDirection: DirectionVo,
    private unitLabel: string | null,
    private unitEmbedCode: string
  ) {
    super(CommandNameEnum.CreateEmbedUnit, id, createdAt, isRemote);
  }

  static create(
    itemId: string,
    itemCompatibleUnitType: UnitTypeEnum,
    itemDimension: DimensionVo,
    unitPosition: PositionVo,
    unitDirection: DirectionVo,
    unitLabel: string | null,
    unitEmbedCode: string
  ) {
    return new CreateEmbedUnitCommand(
      generateUuidV4(),
      DateVo.now(),
      false,
      generateUuidV4(),
      itemId,
      itemCompatibleUnitType,
      itemDimension,
      unitPosition,
      unitDirection,
      unitLabel,
      unitEmbedCode
    );
  }

  static createRemote(
    id: string,
    createdAt: DateVo,
    unitId: string,
    itemId: string,
    itemCompatibleUnitType: UnitTypeEnum,
    itemDimension: DimensionVo,
    unitPosition: PositionVo,
    unitDirection: DirectionVo,
    unitLabel: string | null,
    unitEmbedCode: string
  ) {
    return new CreateEmbedUnitCommand(
      id,
      createdAt,
      true,
      unitId,
      itemId,
      itemCompatibleUnitType,
      itemDimension,
      unitPosition,
      unitDirection,
      unitLabel,
      unitEmbedCode
    );
  }

  public getIsClientOnly = () => false;

  public getRequiredItemId = () => this.itemId;

  public execute({ unitManager, playerManager }: CommandParams): boolean {
    if (this.itemCompatibleUnitType !== UnitTypeEnum.Embed) return false;

    const newUnit = UnitModel.create(
      this.unitId,
      UnitTypeEnum.Embed,
      this.itemId,
      this.unitPosition,
      this.unitDirection,
      this.itemDimension,
      this.unitLabel,
      null
    );

    const occupiedPositions = newUnit.getOccupiedPositions();
    for (let occupiedPositionIdx = 0; occupiedPositionIdx < occupiedPositions.length; occupiedPositionIdx += 1) {
      const occupiedPosition = occupiedPositions[occupiedPositionIdx];
      const unitAtPos = unitManager.getUnitByPos(occupiedPosition);
      if (unitAtPos) return false;

      const playersAtPos = playerManager.getPlayersAtPos(occupiedPosition);
      if (playersAtPos) return false;
    }

    const newUnitAdded = unitManager.addUnit(newUnit);
    if (!newUnitAdded) return false;

    this.setUndoAction(() => {
      unitManager.removeUnit(newUnit.getId());
    });

    return true;
  }

  public getUnitId() {
    return this.unitId;
  }

  public getItemId() {
    return this.itemId;
  }

  public getItemCompatibleUnitType() {
    return this.itemCompatibleUnitType;
  }

  public getItemDimension() {
    return this.itemDimension;
  }

  public getUnitPosition() {
    return this.unitPosition;
  }

  public getUnitDirection() {
    return this.unitDirection;
  }

  public getUnitLabel() {
    return this.unitLabel;
  }

  public getUnitEmbedCode() {
    return this.unitEmbedCode;
  }
}
