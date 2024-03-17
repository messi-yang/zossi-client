import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { StaticUnitModel } from '@/models/world/unit/static-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class CreateStaticUnitCommand extends BaseCommand {
  constructor(id: string, timestamp: number, private unit: StaticUnitModel) {
    super(id, timestamp);
  }

  static new(unit: StaticUnitModel) {
    return new CreateStaticUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unit);
  }

  static load(id: string, timestamp: number, unit: StaticUnitModel) {
    return new CreateStaticUnitCommand(id, timestamp, unit);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.unit.getItemId());
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Static)) return;

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
