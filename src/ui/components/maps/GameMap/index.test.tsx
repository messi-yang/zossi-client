import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { MapUnitVo, GameMapVo, OffsetVo } from '@/models/valueObjects';

function renderGameMap(gameMap: GameMapVo): RenderResult {
  return render(
    <GameMap
      mapRange={null}
      mapRangeOffset={OffsetVo.new(0, 0)}
      gameMap={gameMap}
      mapUnitSize={30}
      items={[]}
      onMapUnitClick={() => {}}
    />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      const mapUnitMatrix = [[MapUnitVo.new(null)]];
      renderGameMap(GameMapVo.new(mapUnitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
