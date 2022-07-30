import { render, RenderResult, screen } from '@testing-library/react';
import UnitMapIcon from '.';
import dataTestids from './dataTestids';

function renderUnitMapIcon(): RenderResult {
  return render(<UnitMapIcon active highlighted={false} />);
}

describe('UnitMapIcon', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitMapIcon();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
