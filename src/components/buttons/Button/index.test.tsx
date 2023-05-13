import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './dataTestids';
import { Button } from '.';

function renderButton(): RenderResult {
  return render(<Button text="Hello" />);
}

describe('Button', () => {
  it('Should render component successfully.', () => {
    try {
      renderButton();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
