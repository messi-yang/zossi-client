import { uniq } from 'lodash';
import { PositionVo } from '@/models/world/common/position-vo';
import { UnitModel } from '@/models/world/unit/unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { StaticUnitModel } from '@/models/world/unit/static-unit-model';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { FenceUnitModel } from '@/models/world/unit/fence-unit-model';
import { LinkUnitModel } from '@/models/world/unit/link-unit-model';
import { dispatchUnit } from '@/models/world/unit/utils';

export type UnitsChangedHandler = (itemId: string, units: UnitModel[]) => void;

export class UnitManager {
  private unitMapByPos: Record<string, UnitModel | undefined>;

  private unitMapByItemId: Record<string, UnitModel[] | undefined>;

  private unitMapByType: {
    [UnitTypeEnum.Static]: StaticUnitModel[];
    [UnitTypeEnum.Fence]: FenceUnitModel[];
    [UnitTypeEnum.Portal]: PortalUnitModel[];
    [UnitTypeEnum.Link]: LinkUnitModel[];
  } = { static: [], fence: [], portal: [], link: [] };

  private unitsChangedHandler: UnitsChangedHandler[] = [];

  constructor(units: UnitModel[]) {
    this.unitMapByPos = {};
    this.unitMapByItemId = {};
    units.forEach((unit) => {
      this.addUnitToUnitMapByPos(unit);
      this.addUnitToUnitMapByItemId(unit);
      this.addUnitToUnitMapByType(unit);
    });
  }

  static new(units: UnitModel[]): UnitManager {
    return new UnitManager(units);
  }

  public getAppearingItemIds(): string[] {
    return Object.keys(this.unitMapByItemId);
  }

  public getUnit(pos: PositionVo): UnitModel | null {
    return this.unitMapByPos[pos.toString()] || null;
  }

  public getUnitsByItemId(itemId: string): UnitModel[] {
    return this.unitMapByItemId[itemId] || [];
  }

  public getPortalUnits() {
    return this.unitMapByType.portal;
  }

  private addUnitToUnitMapByPos(unit: UnitModel) {
    const posKey = unit.getPosition().toString();
    this.unitMapByPos[posKey] = unit;
  }

  private updateUnitInUnitMapByPos(unit: UnitModel) {
    const posKey = unit.getPosition().toString();
    this.unitMapByPos[posKey] = unit;
  }

  private removeUnitFromUnitMapByPos(position: PositionVo) {
    const posKey = position.toString();
    delete this.unitMapByPos[posKey];
  }

  private addUnitToUnitMapByItemId(unit: UnitModel) {
    const itemId = unit.getItemId();
    const unitsWithItemId = this.unitMapByItemId[itemId];
    if (unitsWithItemId) {
      unitsWithItemId.push(unit);
    } else {
      this.unitMapByItemId[itemId] = [unit];
    }
  }

  private updateUnitFromUnitMapByItemId(oldUnit: UnitModel, unit: UnitModel) {
    this.removeUnitFromUnitMapByItemId(oldUnit);
    this.addUnitToUnitMapByItemId(unit);
  }

  private removeUnitFromUnitMapByItemId(oldUnit: UnitModel) {
    const itemId = oldUnit.getItemId();
    const unitsWithItemId = this.unitMapByItemId[itemId];
    if (unitsWithItemId) {
      const newUnitsWithItemId = unitsWithItemId.filter((unit) => !unit.getPosition().isEqual(oldUnit.getPosition()));
      if (newUnitsWithItemId.length === 0) {
        delete this.unitMapByItemId[itemId];
      } else {
        this.unitMapByItemId[itemId] = newUnitsWithItemId;
      }
    }
  }

  private addUnitToUnitMapByType(unit: UnitModel) {
    dispatchUnit(unit, {
      static: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Static].push(_unit);
      },
      fence: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Fence].push(_unit);
      },
      portal: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Portal].push(_unit);
      },
      link: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Link].push(_unit);
      },
    });
  }

  private updateUnitFromUnitMapByType(oldUnit: UnitModel, unit: UnitModel) {
    this.removeUnitFromUnitMapByType(oldUnit);
    this.addUnitToUnitMapByType(unit);
  }

  private removeUnitFromUnitMapByType(oldUnit: UnitModel) {
    dispatchUnit(oldUnit, {
      static: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Static] = this.unitMapByType[UnitTypeEnum.Static].filter(
          (unit) => !unit.getPosition().isEqual(_unit.getPosition())
        );
      },
      fence: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Fence] = this.unitMapByType[UnitTypeEnum.Fence].filter(
          (unit) => !unit.getPosition().isEqual(_unit.getPosition())
        );
      },
      portal: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Portal] = this.unitMapByType[UnitTypeEnum.Portal].filter(
          (unit) => !unit.getPosition().isEqual(_unit.getPosition())
        );
      },
      link: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Link] = this.unitMapByType[UnitTypeEnum.Link].filter(
          (unit) => !unit.getPosition().isEqual(_unit.getPosition())
        );
      },
    });
  }

  public addUnit(unit: UnitModel): boolean {
    const currentUnit = this.getUnit(unit.getPosition());
    if (currentUnit) return false;

    this.addUnitToUnitMapByPos(unit);
    this.addUnitToUnitMapByItemId(unit);
    this.addUnitToUnitMapByType(unit);

    this.publishUnitsChanged(unit.getItemId());
    return true;
  }

  public updateUnit(unit: UnitModel): boolean {
    const currentUnit = this.getUnit(unit.getPosition());
    if (!currentUnit) return false;

    this.updateUnitInUnitMapByPos(unit);
    this.updateUnitFromUnitMapByItemId(currentUnit, unit);
    this.updateUnitFromUnitMapByType(currentUnit, unit);

    const itemIds = [currentUnit.getItemId(), unit.getItemId()];
    uniq(itemIds).forEach((itemId) => {
      this.publishUnitsChanged(itemId);
    });
    return true;
  }

  public removeUnit(position: PositionVo): boolean {
    const currentUnit = this.getUnit(position);
    if (!currentUnit) return false;

    this.removeUnitFromUnitMapByPos(currentUnit.getPosition());
    this.removeUnitFromUnitMapByItemId(currentUnit);
    this.removeUnitFromUnitMapByType(currentUnit);

    this.publishUnitsChanged(currentUnit.getItemId());
    return true;
  }

  public subscribeUnitsChanged(handler: UnitsChangedHandler): () => void {
    this.unitsChangedHandler.push(handler);

    this.getAppearingItemIds().forEach((itemId) => {
      handler(itemId, this.getUnitsByItemId(itemId));
    });

    return () => {
      this.unitsChangedHandler = this.unitsChangedHandler.filter((hdl) => hdl !== handler);
    };
  }

  private publishUnitsChanged(itemId: string) {
    this.unitsChangedHandler.forEach((hdl) => {
      hdl(itemId, this.getUnitsByItemId(itemId));
    });
  }
}
