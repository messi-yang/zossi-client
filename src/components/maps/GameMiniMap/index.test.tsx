import { render, RenderResult, screen } from '@testing-library/react';
import { CoordinateValueObject, MapSizeValueObject, AreaValueObject } from '@/valueObjects';
import GameMiniMap, { dataTestids } from '.';

function renderGameMiniMap(): RenderResult {
  return render(
    <GameMiniMap
      width={300}
      mapSize={new MapSizeValueObject(100, 100)}
      area={new AreaValueObject(new CoordinateValueObject(0, 0), new CoordinateValueObject(10, 10))}
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
