import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';

import { NumberInput } from '.';

function renderNumberInput(): RenderResult {
  return render(<NumberInput value={1} step={1} onInput={() => {}} />);
}

describe('NumberInput', () => {
  it('Should render component successfully.', () => {
    try {
      renderNumberInput();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
