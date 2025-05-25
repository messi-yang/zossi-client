import { generateUuidV4 } from '@/utils/uuid';
import { PositionVo } from '../common/position-vo';
import { DirectionVo } from '../common/direction-vo';
import { DimensionVo } from '../common/dimension-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

/**
 * We will use one of the child of BaseUnitModel "StaticUnitModel" for testing its methods here.
 */
describe('BaseUnitModel', () => {
  describe('getCenterPrecisePosition', () => {
    const unit1 = UnitModel.create(
      generateUuidV4(),
      UnitTypeEnum.Static,
      generateUuidV4(),
      PositionVo.create(0, 0),
      DirectionVo.newDown(),
      DimensionVo.create(3, 4),
      null,
      null
    );

    expect(unit1.getCenterPrecisePosition().isEqual(PrecisePositionVo.create(1, 1.5))).toBeTruthy();

    const unit2 = UnitModel.create(
      generateUuidV4(),
      UnitTypeEnum.Static,
      generateUuidV4(),
      PositionVo.create(0, 0),
      DirectionVo.newDown(),
      DimensionVo.create(1, 1),
      null,
      null
    );

    expect(unit2.getCenterPrecisePosition().isEqual(PrecisePositionVo.create(0, 0))).toBeTruthy();
  });

  describe('getOccupiedPositions', () => {
    describe('Should correctly return all the positions occupied by this unit', () => {
      it('Facing up & down', () => {
        const downUnit = UnitModel.create(
          generateUuidV4(),
          UnitTypeEnum.Static,
          generateUuidV4(),
          PositionVo.create(0, 0),
          DirectionVo.newDown(),
          DimensionVo.create(2, 3),
          null,
          null
        );

        let positions = downUnit.getOccupiedPositions();

        expect(positions.length).toBe(6);
        expect(positions[0].isEqual(PositionVo.create(0, 0))).toBeTruthy();
        expect(positions[positions.length - 1].isEqual(PositionVo.create(1, 2))).toBeTruthy();

        const upUnit = UnitModel.create(
          generateUuidV4(),
          UnitTypeEnum.Static,
          generateUuidV4(),
          PositionVo.create(0, 0),
          DirectionVo.newUp(),
          DimensionVo.create(2, 3),
          null,
          null
        );
        positions = upUnit.getOccupiedPositions();

        expect(positions.length).toBe(6);
        expect(positions[0].isEqual(PositionVo.create(0, 0))).toBeTruthy();
        expect(positions[positions.length - 1].isEqual(PositionVo.create(1, 2))).toBeTruthy();
      });

      it('Facing right & left', () => {
        const rightUnit = UnitModel.create(
          generateUuidV4(),
          UnitTypeEnum.Static,
          generateUuidV4(),
          PositionVo.create(0, 0),
          DirectionVo.newRight(),
          DimensionVo.create(2, 3),
          null,
          null
        );

        let positions = rightUnit.getOccupiedPositions();

        expect(positions.length).toBe(6);
        expect(positions[0].isEqual(PositionVo.create(0, 0))).toBeTruthy();
        expect(positions[positions.length - 1].isEqual(PositionVo.create(2, 1))).toBeTruthy();

        const leftUnit = UnitModel.create(
          generateUuidV4(),
          UnitTypeEnum.Static,
          generateUuidV4(),
          PositionVo.create(0, 0),
          DirectionVo.newRight(),
          DimensionVo.create(2, 3),
          null,
          null
        );

        positions = leftUnit.getOccupiedPositions();

        expect(positions.length).toBe(6);
        expect(positions[0].isEqual(PositionVo.create(0, 0))).toBeTruthy();
        expect(positions[positions.length - 1].isEqual(PositionVo.create(2, 1))).toBeTruthy();
      });
    });
  });
});
