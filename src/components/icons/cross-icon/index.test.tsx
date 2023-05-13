import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { CrossIcon } from '.';

function renderCrossIcon(): RenderResult {
  return render(<CrossIcon highlighted />);
}

describe('CrossIcon', () => {
  it('Should render component successfully.', () => {
    try {
      renderCrossIcon();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
