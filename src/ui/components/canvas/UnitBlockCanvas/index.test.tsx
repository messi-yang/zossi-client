import { render, RenderResult, screen } from '@testing-library/react';
import UnitBlockCanvas, { dataTestids } from '.';
import { DimensionVo, UnitBlockVo } from '@/models/valueObjects';

function renderUnitBlockCanvas(): RenderResult {
  return render(
    <UnitBlockCanvas unitBlock={UnitBlockVo.newWithDimension(DimensionVo.new(1, 1))} unitSize={20} onClick={() => {}} />
  );
}

describe('UnitBlockCanvas', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitBlockCanvas();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
