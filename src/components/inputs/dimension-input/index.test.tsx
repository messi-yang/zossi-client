import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';

import { DimensionInput } from '.';
import { DimensionVo } from '@/models/world/common/dimension-vo';

function renderDimensionInput(): RenderResult {
  return render(<DimensionInput value={DimensionVo.create(0, 0)} onInput={() => {}} />);
}

describe('DimensionInput', () => {
  it('Should render component successfully.', () => {
    try {
      renderDimensionInput();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
