import { render, RenderResult, screen } from '@testing-library/react';
import GameMapCanvas, { dataTestids } from '.';
import { MapSizeVo, GameMapVo } from '@/models/valueObjects';

function renderGameMapCanvas(): RenderResult {
  return render(
    <GameMapCanvas gameMap={GameMapVo.newWithMapSize(MapSizeVo.new(1, 1))} mapUnitSize={20} onClick={() => {}} />
  );
}

describe('GameMapCanvas', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameMapCanvas();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
