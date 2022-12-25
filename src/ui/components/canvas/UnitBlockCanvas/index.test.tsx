import { render, RenderResult, screen } from '@testing-library/react';
import { createDimension, createUnitBlockByDimension } from '@/models/valueObjects/factories';
import UnitBlockCanvas, { dataTestids } from '.';

function renderUnitBlockCanvas(): RenderResult {
  return render(
    <UnitBlockCanvas unitBlock={createUnitBlockByDimension(createDimension(1, 1))} unitSize={20} onClick={() => {}} />
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
