import { render, RenderResult, screen } from '@testing-library/react';
import SmallLogo from '.';
import dataTestids from './dataTestids';

function renderSmallLogo(): RenderResult {
  return render(<SmallLogo />);
}

describe('SmallLogo', () => {
  it('Should render component successfully.', () => {
    try {
      renderSmallLogo();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
