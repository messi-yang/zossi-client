export class UnitTypeModel {
  constructor(private unitType: 'static' | 'portal') {}

  static new = (unitType: 'static' | 'portal'): UnitTypeModel => {
    if (unitType !== 'static' && unitType !== 'portal') throw new Error('Invalid unit type');
    return new UnitTypeModel(unitType);
  };

  public isStatic(): boolean {
    return this.unitType === 'static';
  }

  public isPortal(): boolean {
    return this.unitType === 'portal';
  }
}
