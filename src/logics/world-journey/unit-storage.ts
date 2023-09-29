import { uniq } from 'lodash';
import { PositionModel } from '@/models/world/position-model';
import { UnitModel } from '@/models/world/unit-model';

type UnitsChangedHandler = (itemId: string, units: UnitModel[] | null) => void;

export class UnitStorage {
  private unitMapByPos: Record<string, UnitModel | undefined>;

  private unitsMapByItemId: Record<string, UnitModel[] | undefined>;

  private unitsChangedHandler: UnitsChangedHandler[] = [];

  constructor(units: UnitModel[]) {
    this.unitMapByPos = {};
    this.unitsMapByItemId = {};
    units.forEach((unit) => {
      this.addUnitToUnitMapByItemId(unit);
      this.addUnitToUnitMapByPos(unit);
    });
  }

  static new(units: UnitModel[]): UnitStorage {
    return new UnitStorage(units);
  }

  public getAppearingItemIds(): string[] {
    return Object.keys(this.unitsMapByItemId);
  }

  public getUnit(pos: PositionModel): UnitModel | null {
    return this.unitMapByPos[pos.toString()] || null;
  }

  public getUnitsByItemId(itemId: string): UnitModel[] | null {
    return this.unitsMapByItemId[itemId] || null;
  }

  private addUnitToUnitMapByPos(unit: UnitModel) {
    const posKey = unit.getPosition().toString();
    this.unitMapByPos[posKey] = unit;
  }

  private updateUnitInUnitMapByPos(unit: UnitModel) {
    const posKey = unit.getPosition().toString();
    this.unitMapByPos[posKey] = unit;
  }

  private removeUnitFromUnitMapByPos(position: PositionModel) {
    const posKey = position.toString();
    delete this.unitMapByPos[posKey];
  }

  private addUnitToUnitMapByItemId(unit: UnitModel) {
    const itemId = unit.getItemId();
    const unitsWithItemId = this.unitsMapByItemId[itemId];
    if (unitsWithItemId) {
      unitsWithItemId.push(unit);
    } else {
      this.unitsMapByItemId[itemId] = [unit];
    }
  }

  private removeUnitFromUnitMapByItemId(oldUnit: UnitModel) {
    const itemId = oldUnit.getItemId();
    const unitsWithItemId = this.unitsMapByItemId[itemId];
    if (unitsWithItemId) {
      const newUnitsWithItemId = unitsWithItemId.filter((unit) => !unit.getPosition().isEqual(oldUnit.getPosition()));
      if (newUnitsWithItemId.length === 0) {
        delete this.unitsMapByItemId[itemId];
      } else {
        this.unitsMapByItemId[itemId] = newUnitsWithItemId;
      }
    }
  }

  private updateUnitFromUnitMapByItemId(oldUnit: UnitModel, unit: UnitModel) {
    this.removeUnitFromUnitMapByItemId(oldUnit);
    this.addUnitToUnitMapByItemId(unit);
  }

  public addUnit(unit: UnitModel) {
    const currentUnit = this.getUnit(unit.getPosition());
    if (currentUnit) return;

    this.addUnitToUnitMapByPos(unit);
    this.addUnitToUnitMapByItemId(unit);

    this.publishUnitsChanged(unit.getItemId());
  }

  public updateUnit(unit: UnitModel) {
    const currentUnit = this.getUnit(unit.getPosition());
    if (!currentUnit) return;

    this.updateUnitInUnitMapByPos(unit);
    this.updateUnitFromUnitMapByItemId(currentUnit, unit);

    const itemIds = [currentUnit.getItemId(), unit.getItemId()];
    uniq(itemIds).forEach((itemId) => {
      this.publishUnitsChanged(itemId);
    });
  }

  public removeUnit(position: PositionModel) {
    const currentUnit = this.getUnit(position);
    if (!currentUnit) return;

    this.removeUnitFromUnitMapByPos(currentUnit.getPosition());
    this.removeUnitFromUnitMapByItemId(currentUnit);

    this.publishUnitsChanged(currentUnit.getItemId());
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
