import { render, RenderResult, screen } from '@testing-library/react';
import CrossIcon, { dataTestids } from '.';

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
