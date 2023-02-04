import { render, RenderResult, screen } from '@testing-library/react';
import { BoundVo, LocationVo, SizeVo } from '@/models/valueObjects';
import GameMiniMap, { dataTestids } from '.';

function renderGameMiniMap(): RenderResult {
  return render(
    <GameMiniMap
      width={300}
      mapSize={SizeVo.new(100, 100)}
      bound={BoundVo.new(LocationVo.new(0, 10), LocationVo.new(20, 30))}
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
