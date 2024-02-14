import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class CreatePortalUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  constructor(id: string, timestamp: number, private unit: PortalUnitModel) {
    this.id = id;
    this.timestamp = timestamp;
  }

  static new(unit: PortalUnitModel) {
    return new CreatePortalUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unit);
  }

  static load(id: string, timestamp: number, unit: PortalUnitModel) {
    return new CreatePortalUnitCommand(id, timestamp, unit);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.unit.getItemId());
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Portal)) return;

    const unitAtPos = unitManager.getUnitByPos(this.unit.getPosition());
    if (unitAtPos) return;

    const playersAtPos = playerManager.getPlayersAtPos(this.unit.getPosition());
    if (playersAtPos) return;

    const newPortalUnit = this.unit;

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

  public getUnit() {
    return this.unit;
  }
}
