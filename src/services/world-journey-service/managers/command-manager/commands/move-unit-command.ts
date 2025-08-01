import { DirectionVo } from '@/models/world/common/direction-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';
import { ColorVo } from '@/models/world/common/color-vo';
import { isPositionsOccupied } from './utils';
import { UnitModel } from '@/models/world/unit/unit-model';
import { DimensionVo } from '@/models/world/common/dimension-vo';

export class MoveUnitCommand extends Command {
  constructor(
    id: string,
    createdAt: DateVo,
    isRemote: boolean,
    private unitId: string,
    private unitType: UnitTypeEnum,
    private itemId: string,
    private itemDimension: DimensionVo,
    private unitPosition: PositionVo,
    private unitDirection: DirectionVo,
    private unitLabel: string | null,
    private unitColor: ColorVo | null
  ) {
    super(CommandNameEnum.MoveUnit, id, createdAt, isRemote);
  }

  static create(
    unitId: string,
    unitType: UnitTypeEnum,
    itemId: string,
    itemDimension: DimensionVo,
    unitPosition: PositionVo,
    unitDirection: DirectionVo,
    unitLabel: string | null,
    unitColor: ColorVo | null
  ) {
    return new MoveUnitCommand(
      generateUuidV4(),
      DateVo.now(),
      false,
      unitId,
      unitType,
      itemId,
      itemDimension,
      unitPosition,
      unitDirection,
      unitLabel,
      unitColor
    );
  }

  static createRemote(
    id: string,
    createdAt: DateVo,
    unitId: string,
    unitType: UnitTypeEnum,
    itemId: string,
    itemDimension: DimensionVo,
    unitPosition: PositionVo,
    unitDirection: DirectionVo,
    unitLabel: string | null,
    unitColor: ColorVo | null
  ) {
    return new MoveUnitCommand(
      id,
      createdAt,
      true,
      unitId,
      unitType,
      itemId,
      itemDimension,
      unitPosition,
      unitDirection,
      unitLabel,
      unitColor
    );
  }

  public getIsClientOnly = () => false;

  public getRequiredItemId = () => this.itemId;

  public execute({ unitManager, playerManager }: CommandParams): boolean {
    const existingUnit = unitManager.getUnit(this.unitId);

    if (existingUnit) {
      let isExistingUnitUpdated = false;
      const clonedExistingUnit = existingUnit.clone();
      clonedExistingUnit.move(this.unitPosition);

      if (isPositionsOccupied(clonedExistingUnit.getOccupiedPositions(), unitManager, playerManager)) {
        return false;
      }

      isExistingUnitUpdated = unitManager.updateUnit(clonedExistingUnit);

      this.setUndoAction(() => {
        if (isExistingUnitUpdated) {
          unitManager.updateUnit(existingUnit);
        }
      });
    } else {
      const newUnit = UnitModel.create(
        this.unitId,
        this.unitType,
        this.itemId,
        this.unitPosition,
        this.unitDirection,
        this.itemDimension,
        this.unitLabel,
        this.unitColor
      );

      if (isPositionsOccupied(newUnit.getOccupiedPositions(), unitManager, playerManager)) {
        return false;
      }

      const newUnitAdded = unitManager.addUnit(newUnit);
      if (!newUnitAdded) return false;

      this.setUndoAction(() => {
        unitManager.removeUnit(newUnit.getId());
      });
    }

    return true;
  }

  public getUnitId() {
    return this.unitId;
  }

  public getUnitType() {
    return this.unitType;
  }

  public getItemId() {
    return this.itemId;
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

  public getUnitColor() {
    return this.unitColor;
  }
}
