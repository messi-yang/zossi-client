import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemoveFenceUnitCommand extends Command {
  private unitId: string;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, unitId: string) {
    super(id, createdAt, isRemote);
    this.unitId = unitId;
  }

  static create(unitId: string) {
    return new RemoveFenceUnitCommand(generateUuidV4(), DateVo.now(), false, unitId);
  }

  static createRemote(id: string, createdAt: DateVo, unitId: string) {
    return new RemoveFenceUnitCommand(id, createdAt, true, unitId);
  }

  public getIsClientOnly = () => false;

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
