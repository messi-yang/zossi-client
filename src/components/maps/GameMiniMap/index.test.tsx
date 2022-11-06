import { render, RenderResult, screen } from '@testing-library/react';
import { createCoordinate, createArea, createDimension } from '@/valueObjects/factories';
import GameMiniMap, { dataTestids } from '.';

function renderGameMiniMap(): RenderResult {
  return render(
    <GameMiniMap
      width={300}
      dimension={createDimension(100, 100)}
      area={createArea(createCoordinate(0, 0), createCoordinate(10, 10))}
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
