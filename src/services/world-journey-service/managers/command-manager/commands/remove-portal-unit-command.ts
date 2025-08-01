import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';

export class RemovePortalUnitCommand extends Command {
  private unitId: string;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, unitId: string) {
    super(CommandNameEnum.RemovePortalUnit, id, createdAt, isRemote);
    this.unitId = unitId;
  }

  static create(unitId: string) {
    return new RemovePortalUnitCommand(generateUuidV4(), DateVo.now(), false, unitId);
  }

  static createRemote(id: string, createdAt: DateVo, unitId: string) {
    return new RemovePortalUnitCommand(id, createdAt, true, unitId);
  }

  public getIsClientOnly = () => false;

  public getRequiredItemId = () => null;

  public execute({ unitManager }: CommandParams): boolean {
    const portalUnit = unitManager.getUnit(this.unitId);
    if (!portalUnit) return false;

    const isUnitRemoved = unitManager.removeUnit(this.unitId);
    if (!isUnitRemoved) return false;

    this.setUndoAction(() => {
      unitManager.addUnit(portalUnit);
    });

    return true;
  }

  public getUnitId() {
    return this.unitId;
  }
}
