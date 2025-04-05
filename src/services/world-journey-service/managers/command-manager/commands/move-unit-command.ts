import { DirectionVo } from '@/models/world/common/direction-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';
import { ColorVo } from '@/models/world/common/color-vo';
import { createUnitModel } from '@/models/world/unit/utils';
import { isPositionsOccupied } from './utils';

export class MoveUnitCommand extends Command {
  constructor(
    id: string,
    createdAt: DateVo,
    isRemote: boolean,
    private unitId: string,
    private unitType: UnitTypeEnum,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo,
    private label: string | null,
    private color: ColorVo | null
  ) {
    super(CommandNameEnum.MoveUnit, id, createdAt, isRemote);
  }

  static create(
    unitId: string,
    unitType: UnitTypeEnum,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    label: string | null,
    color: ColorVo | null
  ) {
    return new MoveUnitCommand(generateUuidV4(), DateVo.now(), false, unitId, unitType, itemId, position, direction, label, color);
  }

  static createRemote(
    id: string,
    createdAt: DateVo,
    unitId: string,
    unitType: UnitTypeEnum,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    label: string | null,
    color: ColorVo | null
  ) {
    return new MoveUnitCommand(id, createdAt, true, unitId, unitType, itemId, position, direction, label, color);
  }

  public getIsClientOnly = () => false;

  public getRequiredItemId = () => this.itemId;

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    const existingUnit = unitManager.getUnit(this.unitId);

    if (existingUnit) {
      let isExistingUnitUpdated = false;
      const clonedExistingUnit = existingUnit.clone();
      clonedExistingUnit.move(this.position);

      if (isPositionsOccupied(clonedExistingUnit.getOccupiedPositions(), unitManager, playerManager)) {
        return;
      }

      isExistingUnitUpdated = unitManager.updateUnit(clonedExistingUnit);

      this.setUndoAction(() => {
        if (isExistingUnitUpdated) {
          unitManager.updateUnit(existingUnit);
        }
      });
    } else {
      const newUnit = createUnitModel(
        this.unitId,
        this.unitType,
        this.itemId,
        this.position,
        this.direction,
        item.getDimension(),
        this.label,
        this.color
      );

      // if (isPositionsOccupied(newUnit.getOccupiedPositions(), unitManager, playerManager)) {
      //   return;
      // }
      alert('move unit');

      const newUnitAdded = unitManager.addUnit(newUnit);
      this.setUndoAction(() => {
        if (newUnitAdded) {
          unitManager.removeUnit(newUnit.getId());
        }
      });
    }
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

  public getPosition() {
    return this.position;
  }

  public getDirection() {
    return this.direction;
  }

  public getLabel() {
    return this.label;
  }

  public getColor() {
    return this.color;
  }
}
