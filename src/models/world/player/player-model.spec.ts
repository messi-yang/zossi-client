import { DimensionVo } from '../common/dimension-vo';
import { DirectionVo } from '../common/direction-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';
import { PlayerActionVo } from './player-action-vo';
import { PlayerModel } from './player-model';
import { PositionVo } from '../common/position-vo';

describe('PlayerModel', () => {
  describe('getDesiredNewUnitPosition', () => {
    it('When facing down', () => {
      const player = PlayerModel.mockup();
      player.updateAction(PlayerActionVo.newStand(PrecisePositionVo.new(0, 0), DirectionVo.newDown()));

      expect(player.getDesiredNewUnitPosition(DimensionVo.new(3, 3)).isEqual(PositionVo.new(-1, 1))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.new(2, 2)).isEqual(PositionVo.new(0, 1))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.new(1, 1)).isEqual(PositionVo.new(0, 1))).toBeTruthy();
    });

    it('When facing right', () => {
      const player = PlayerModel.mockup();
      player.updateAction(PlayerActionVo.newStand(PrecisePositionVo.new(0, 0), DirectionVo.newRight()));

      expect(player.getDesiredNewUnitPosition(DimensionVo.new(3, 3)).isEqual(PositionVo.new(1, -1))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.new(2, 2)).isEqual(PositionVo.new(1, 0))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.new(1, 1)).isEqual(PositionVo.new(1, 0))).toBeTruthy();
    });

    it('When facing up', () => {
      const player = PlayerModel.mockup();
      player.updateAction(PlayerActionVo.newStand(PrecisePositionVo.new(0, 0), DirectionVo.newUp()));

      expect(player.getDesiredNewUnitPosition(DimensionVo.new(3, 3)).isEqual(PositionVo.new(-1, -3))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.new(2, 2)).isEqual(PositionVo.new(0, -2))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.new(1, 1)).isEqual(PositionVo.new(0, -1))).toBeTruthy();
    });

    it('When facing left', () => {
      const player = PlayerModel.mockup();
      player.updateAction(PlayerActionVo.newStand(PrecisePositionVo.new(0, 0), DirectionVo.newLeft()));

      expect(player.getDesiredNewUnitPosition(DimensionVo.new(3, 3)).isEqual(PositionVo.new(-3, -1))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.new(2, 2)).isEqual(PositionVo.new(-2, 0))).toBeTruthy();
      expect(player.getDesiredNewUnitPosition(DimensionVo.new(1, 1)).isEqual(PositionVo.new(-1, 0))).toBeTruthy();
    });
  });
});
