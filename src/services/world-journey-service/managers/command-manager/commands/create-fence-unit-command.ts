import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { FenceUnitModel } from '@/models/world/unit/fence-unit-model';
import { generateUuidV4 } from '@/utils/uuid';

export class CreateFenceUnitCommand extends BaseCommand {
  constructor(id: string, timestamp: number, private unit: FenceUnitModel) {
    super(id, timestamp);
  }

  static new(unit: FenceUnitModel) {
    return new CreateFenceUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unit);
  }

  static load(id: string, timestamp: number, unit: FenceUnitModel) {
    return new CreateFenceUnitCommand(id, timestamp, unit);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.unit.getItemId());
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Fence)) return;

    const unitAtPos = unitManager.getUnitByPos(this.unit.getPosition());
    if (unitAtPos) return;

    const playersAtPos = playerManager.getPlayersAtPos(this.unit.getPosition());
    if (playersAtPos) return;

    unitManager.addUnit(this.unit);
  }

  public getUnit() {
    return this.unit;
  }
}
