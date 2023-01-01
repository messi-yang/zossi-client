import { render, RenderResult, screen } from '@testing-library/react';
import { AreaVo, CoordinateVo, DimensionVo } from '@/models/valueObjects';
import GameMiniMap, { dataTestids } from '.';

function renderGameMiniMap(): RenderResult {
  return render(
    <GameMiniMap
      width={300}
      dimension={DimensionVo.new(100, 100)}
      area={AreaVo.new(CoordinateVo.new(0, 0), CoordinateVo.new(10, 10))}
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
