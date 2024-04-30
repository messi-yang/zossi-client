import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemoveFenceUnitCommand extends BaseCommand {
  private unitId: string;

  constructor(id: string, timestamp: number, isRemote: boolean, unitId: string) {
    super(id, timestamp, isRemote);
    this.unitId = unitId;
  }

  static create(unitId: string) {
    return new RemoveFenceUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, unitId);
  }

  static createRemote(id: string, timestamp: number, unitId: string) {
    return new RemoveFenceUnitCommand(id, timestamp, true, unitId);
  }

  public getIsReplayable = () => true;

  public execute({ unitManager }: CommandParams): void {
    const currentUnit = unitManager.getUnit(this.unitId);
    if (!currentUnit) return;

    const hasRemovedUnit = unitManager.removeUnit(this.unitId);

    this.setUndoAction(() => {
      if (hasRemovedUnit) {
        unitManager.addUnit(currentUnit);
      }
    });
  }

  public getUnitId() {
    return this.unitId;
  }
}
