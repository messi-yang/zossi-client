import { render, RenderResult, screen } from '@testing-library/react';
import GameMiniMap, { dataTestids } from '.';

function renderGameMiniMap(): RenderResult {
  return render(
    <GameMiniMap
      width={300}
      mapSize={{ width: 100, height: 100 }}
      area={{ from: { x: 0, y: 0 }, to: { x: 10, y: 10 } }}
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
