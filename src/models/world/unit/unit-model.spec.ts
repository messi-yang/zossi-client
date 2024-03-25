import { generateUuidV4 } from '@/utils/uuid';
import { StaticUnitModel } from './static-unit-model';
import { PositionVo } from '../common/position-vo';
import { DirectionVo } from '../common/direction-vo';
import { DimensionVo } from '../common/dimension-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';

/**
 * We will use one of the child of BaseUnitModel "StaticUnitModel" for testing its methods here.
 */
describe('BaseUnitModel', () => {
  describe('getCenterPrecisePosition', () => {
    const unit1 = StaticUnitModel.new(
      generateUuidV4(),
      generateUuidV4(),
      PositionVo.new(0, 0),
      DirectionVo.newDown(),
      DimensionVo.new(3, 4)
    );

    expect(unit1.getCenterPrecisePosition().isEqual(PrecisePositionVo.new(1, 1.5))).toBeTruthy();

    const unit2 = StaticUnitModel.new(
      generateUuidV4(),
      generateUuidV4(),
      PositionVo.new(0, 0),
      DirectionVo.newDown(),
      DimensionVo.new(1, 1)
    );

    expect(unit2.getCenterPrecisePosition().isEqual(PrecisePositionVo.new(0, 0))).toBeTruthy();
  });

  describe('getOccupiedPositions', () => {
    describe('Should correctly return all the positions occupied by this unit', () => {
      it('Facing up & down', () => {
        const downUnit = StaticUnitModel.new(
          generateUuidV4(),
          generateUuidV4(),
          PositionVo.new(0, 0),
          DirectionVo.newDown(),
          DimensionVo.new(2, 3)
        );

        let positions = downUnit.getOccupiedPositions();

        expect(positions.length).toBe(6);
        expect(positions[0].isEqual(PositionVo.new(0, 0))).toBeTruthy();
        expect(positions[positions.length - 1].isEqual(PositionVo.new(1, 2))).toBeTruthy();

        const upUnit = StaticUnitModel.new(
          generateUuidV4(),
          generateUuidV4(),
          PositionVo.new(0, 0),
          DirectionVo.newUp(),
          DimensionVo.new(2, 3)
        );
        positions = upUnit.getOccupiedPositions();

        expect(positions.length).toBe(6);
        expect(positions[0].isEqual(PositionVo.new(0, 0))).toBeTruthy();
        expect(positions[positions.length - 1].isEqual(PositionVo.new(1, 2))).toBeTruthy();
      });

      it('Facing right & left', () => {
        const rightUnit = StaticUnitModel.new(
          generateUuidV4(),
          generateUuidV4(),
          PositionVo.new(0, 0),
          DirectionVo.newRight(),
          DimensionVo.new(2, 3)
        );

        let positions = rightUnit.getOccupiedPositions();

        expect(positions.length).toBe(6);
        expect(positions[0].isEqual(PositionVo.new(0, 0))).toBeTruthy();
        expect(positions[positions.length - 1].isEqual(PositionVo.new(2, 1))).toBeTruthy();

        const leftUnit = StaticUnitModel.new(
          generateUuidV4(),
          generateUuidV4(),
          PositionVo.new(0, 0),
          DirectionVo.newRight(),
          DimensionVo.new(2, 3)
        );

        positions = leftUnit.getOccupiedPositions();

        expect(positions.length).toBe(6);
        expect(positions[0].isEqual(PositionVo.new(0, 0))).toBeTruthy();
        expect(positions[positions.length - 1].isEqual(PositionVo.new(2, 1))).toBeTruthy();
      });
    });
  });
});
