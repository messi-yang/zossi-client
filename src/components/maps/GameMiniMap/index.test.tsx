import { render, RenderResult, screen } from '@testing-library/react';
import { CoordinateVo, MapSizeVo } from '@/valueObjects';
import GameMiniMap, { dataTestids } from '.';

function renderGameMiniMap(): RenderResult {
  return render(
    <GameMiniMap
      width={300}
      mapSize={new MapSizeVo(100, 100)}
      area={{ from: new CoordinateVo(0, 0), to: new CoordinateVo(10, 10) }}
      onAreaUpdate={() => {}}
    />
  );
}

describe('GameMiniMap', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameMiniMap();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
