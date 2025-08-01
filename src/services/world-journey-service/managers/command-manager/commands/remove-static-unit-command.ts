import { Command } from '../command';
import { CommandNameEnum } from '../command-name-enum';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemoveStaticUnitCommand extends Command {
  private unitId: string;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, unitId: string) {
    super(CommandNameEnum.RemoveStaticUnit, id, createdAt, isRemote);
    this.unitId = unitId;
  }

  static create(unitId: string) {
    return new RemoveStaticUnitCommand(generateUuidV4(), DateVo.now(), false, unitId);
  }

  static createRemote(id: string, createdAt: DateVo, unitId: string) {
    return new RemoveStaticUnitCommand(id, createdAt, true, unitId);
  }

  public getIsClientOnly = () => false;

  public getRequiredItemId = () => null;

  public execute({ unitManager }: CommandParams): boolean {
    const currentUnit = unitManager.getUnit(this.unitId);
    if (!currentUnit) return false;

    const isUnitRemoved = unitManager.removeUnit(this.unitId);
    if (!isUnitRemoved) return false;

    this.setUndoAction(() => {
      unitManager.addUnit(currentUnit);
    });

    return true;
  }

  public getUnitId() {
    return this.unitId;
  }
}
