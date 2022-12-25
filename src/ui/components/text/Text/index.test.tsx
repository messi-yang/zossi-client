import { render, RenderResult, screen } from '@testing-library/react';
import Text, { dataTestids } from '.';

function renderText(): RenderResult {
  return render(<Text />);
}

describe('Text', () => {
  it('Should render component successfully.', () => {
    try {
      renderText();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
