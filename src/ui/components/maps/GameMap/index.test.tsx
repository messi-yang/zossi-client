import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { UnitVo, UnitBlockVo, OffsetVo } from '@/models/valueObjects';

function renderGameMap(unitBlock: UnitBlockVo): RenderResult {
  return render(<GameMap area={null} areaOffset={OffsetVo.new(0, 0)} unitBlock={unitBlock} onUnitClick={() => {}} />);
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      const unitMatrix = [[UnitVo.new(null)]];
      renderGameMap(UnitBlockVo.new(unitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
