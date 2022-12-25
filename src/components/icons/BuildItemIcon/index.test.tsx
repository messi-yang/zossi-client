import { render, RenderResult, screen } from '@testing-library/react';
import BuildItemIcon, { dataTestids } from '.';

function renderBuildItemIcon(): RenderResult {
  return render(<BuildItemIcon active highlighted={false} />);
}

describe('BuildItemIcon', () => {
  it('Should render component successfully.', () => {
    try {
      renderBuildItemIcon();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
