import { uniq } from 'lodash';
import { PositionVo } from '@/models/world/common/position-vo';
import { UnitModel } from '@/models/world/unit/unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { StaticUnitModel } from '@/models/world/unit/static-unit-model';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { FenceUnitModel } from '@/models/world/unit/fence-unit-model';
import { LinkUnitModel } from '@/models/world/unit/link-unit-model';
import { dispatchUnit } from '@/models/world/unit/utils';
import { EmbedUnitModel } from '@/models/world/unit/embed-unit-model';
import { EventHandler, EventHandlerSubscriber } from '../common/event-handler';

export class UnitManager {
  private unitMapById: Record<string, UnitModel | undefined>;

  private unitMapByPos: Record<string, UnitModel | undefined>;

  private unitMapByItemId: Record<string, UnitModel[] | undefined>;

  private unitsChangedEventHandler = EventHandler.create<[itemId: string, units: UnitModel[]]>();

  private unitMapByType: {
    [UnitTypeEnum.Static]: StaticUnitModel[];
    [UnitTypeEnum.Fence]: FenceUnitModel[];
    [UnitTypeEnum.Portal]: PortalUnitModel[];
    [UnitTypeEnum.Link]: LinkUnitModel[];
    [UnitTypeEnum.Embed]: EmbedUnitModel[];
  } = { static: [], fence: [], portal: [], link: [], embed: [] };

  constructor(units: UnitModel[]) {
    this.unitMapById = {};
    this.unitMapByPos = {};
    this.unitMapByItemId = {};
    units.forEach((unit) => {
      this.addUnitToUnitMapById(unit);
      this.addUnitToUnitMapByPos(unit);
      this.addUnitToUnitMapByItemId(unit);
      this.addUnitToUnitMapByType(unit);
    });
  }

  static create(units: UnitModel[]): UnitManager {
    return new UnitManager(units);
  }

  public getAppearingItemIds(): string[] {
    return Object.keys(this.unitMapByItemId);
  }

  public getUnit(id: string): UnitModel | null {
    return this.unitMapById[id] || null;
  }

  public getUnitByPos(pos: PositionVo): UnitModel | null {
    return this.unitMapByPos[pos.toString()] || null;
  }

  public getUnitsByItemId(itemId: string): UnitModel[] {
    return this.unitMapByItemId[itemId] || [];
  }

  public getAllUnitsByItemId(): { [itemId: string]: UnitModel[] } {
    const res: { [itemId: string]: UnitModel[] } = {};
    Object.entries(this.unitMapByItemId).forEach(([itemId, units]) => {
      if (units) {
        res[itemId] = units;
      }
    });
    return res;
  }

  public getPortalUnits() {
    return this.unitMapByType.portal;
  }

  private addUnitToUnitMapById(unit: UnitModel) {
    this.unitMapById[unit.getId()] = unit;
  }

  private updateUnitInUnitMapById(unit: UnitModel) {
    this.unitMapById[unit.getId()] = unit;
  }

  private removeUnitFromUnitMapById(id: string) {
    delete this.unitMapById[id];
  }

  private addUnitToUnitMapByPos(unit: UnitModel) {
    unit.getOccupiedPositions().forEach((occupiedPos) => {
      const posKey = occupiedPos.toString();
      this.unitMapByPos[posKey] = unit;
    });
  }

  private updateUnitInUnitMapByPos(oldUnit: UnitModel, unit: UnitModel) {
    this.removeUnitFromUnitMapByPos(oldUnit);
    this.addUnitToUnitMapByPos(unit);
  }

  private removeUnitFromUnitMapByPos(unit: UnitModel) {
    unit.getOccupiedPositions().forEach((occupiedPos) => {
      const posKey = occupiedPos.toString();
      delete this.unitMapByPos[posKey];
    });
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
      embed: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Embed].push(_unit);
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
      embed: (_unit) => {
        this.unitMapByType[UnitTypeEnum.Embed] = this.unitMapByType[UnitTypeEnum.Embed].filter(
          (unit) => !unit.getPosition().isEqual(_unit.getPosition())
        );
      },
    });
  }

  /**
   * Add the unit
   * @returns isStateChanged
   */
  public addUnit(unit: UnitModel): boolean {
    const unitAtPos = this.getUnitByPos(unit.getPosition());
    if (unitAtPos) return false;

    this.addUnitToUnitMapById(unit);
    this.addUnitToUnitMapByPos(unit);
    this.addUnitToUnitMapByItemId(unit);
    this.addUnitToUnitMapByType(unit);

    this.publishUnitsChangedEvent(unit.getItemId());
    return true;
  }

  /**
   * Update the unit
   * @returns isStateChanged
   */
  public updateUnit(unit: UnitModel): boolean {
    const currentUnit = this.getUnit(unit.getId());
    if (!currentUnit) return false;

    this.updateUnitInUnitMapById(unit);
    this.updateUnitInUnitMapByPos(currentUnit, unit);
    this.updateUnitFromUnitMapByItemId(currentUnit, unit);
    this.updateUnitFromUnitMapByType(currentUnit, unit);

    const itemIds = [currentUnit.getItemId(), unit.getItemId()];
    uniq(itemIds).forEach((itemId) => {
      this.publishUnitsChangedEvent(itemId);
    });
    return true;
  }

  /**
   * Remove the unit
   * @returns isStateChanged
   */
  public removeUnit(id: string): boolean {
    const currentUnit = this.getUnit(id);
    if (!currentUnit) return false;

    this.removeUnitFromUnitMapById(currentUnit.getId());
    this.removeUnitFromUnitMapByPos(currentUnit);
    this.removeUnitFromUnitMapByItemId(currentUnit);
    this.removeUnitFromUnitMapByType(currentUnit);

    this.publishUnitsChangedEvent(currentUnit.getItemId());
    return true;
  }

  public subscribeUnitsChangedEvent(
    subscriber: EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>
  ): () => void {
    this.getAppearingItemIds().forEach((itemId) => {
      subscriber([itemId, this.getUnitsByItemId(itemId)]);
    });

    return this.unitsChangedEventHandler.subscribe(subscriber);
  }

  private publishUnitsChangedEvent(itemId: string) {
    this.unitsChangedEventHandler.publish([itemId, this.getUnitsByItemId(itemId)]);
  }
}
