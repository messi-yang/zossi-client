import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { GameMapUnitVo, GameMapVo, OffsetVo } from '@/models/valueObjects';

function renderGameMap(gameMap: GameMapVo): RenderResult {
  return render(
    <GameMap mapRange={null} mapRangeOffset={OffsetVo.new(0, 0)} gameMap={gameMap} onGameMapUnitClick={() => {}} />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      const gameMapUnitMatrix = [[GameMapUnitVo.new(null)]];
      renderGameMap(GameMapVo.new(gameMapUnitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
