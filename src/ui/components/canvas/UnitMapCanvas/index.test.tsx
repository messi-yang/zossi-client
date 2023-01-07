import { render, RenderResult, screen } from '@testing-library/react';
import UnitMapCanvas, { dataTestids } from '.';
import { MapSizeVo, UnitMapVo } from '@/models/valueObjects';

function renderUnitMapCanvas(): RenderResult {
  return render(
    <UnitMapCanvas
      unitMap={UnitMapVo.newWithMapSize(MapSizeVo.new(1, 1))}
      unitSize={20}
      onClick={() => {}}
      items={[]}
      selectedItemId={null}
    />
  );
}

describe('UnitMapCanvas', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitMapCanvas();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
