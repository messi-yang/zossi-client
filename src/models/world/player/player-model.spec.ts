import { DimensionVo } from '../common/dimension-vo';
import { DirectionVo } from '../common/direction-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';
import { PlayerActionVo } from './player-action-vo';
import { PlayerModel } from './player-model';
import { PositionVo } from '../common/position-vo';

describe('PlayerModel', () => {
  describe('getDesiredNewUnitPosition', () => {
    it('When facing down', () => {
      const player = PlayerModel.createMock();
      player.updateAction(PlayerActionVo.newStand(PrecisePositionVo.create(0, 0), DirectionVo.newDown()));

      expect(player.getDesiredNewUnitPosition(DimensionVo.create(3, 3)).isEqual(PositionVo.create(-1, 1))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.create(2, 2)).isEqual(PositionVo.create(0, 1))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.create(1, 1)).isEqual(PositionVo.create(0, 1))).toBeTruthy();
    });

    it('When facing right', () => {
      const player = PlayerModel.createMock();
      player.updateAction(PlayerActionVo.newStand(PrecisePositionVo.create(0, 0), DirectionVo.newRight()));

      expect(player.getDesiredNewUnitPosition(DimensionVo.create(3, 3)).isEqual(PositionVo.create(1, -1))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.create(2, 2)).isEqual(PositionVo.create(1, 0))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.create(1, 1)).isEqual(PositionVo.create(1, 0))).toBeTruthy();
    });

    it('When facing up', () => {
      const player = PlayerModel.createMock();
      player.updateAction(PlayerActionVo.newStand(PrecisePositionVo.create(0, 0), DirectionVo.newUp()));

      expect(
        player.getDesiredNewUnitPosition(DimensionVo.create(3, 3)).isEqual(PositionVo.create(-1, -3))
      ).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.create(2, 2)).isEqual(PositionVo.create(0, -2))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.create(1, 1)).isEqual(PositionVo.create(0, -1))).toBeTruthy();
    });

    it('When facing left', () => {
      const player = PlayerModel.createMock();
      player.updateAction(PlayerActionVo.newStand(PrecisePositionVo.create(0, 0), DirectionVo.newLeft()));

      expect(
        player.getDesiredNewUnitPosition(DimensionVo.create(3, 3)).isEqual(PositionVo.create(-3, -1))
      ).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.create(2, 2)).isEqual(PositionVo.create(-2, 0))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.create(1, 1)).isEqual(PositionVo.create(-1, 0))).toBeTruthy();
    });
  });
});
