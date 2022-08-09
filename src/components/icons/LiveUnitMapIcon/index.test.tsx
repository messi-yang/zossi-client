import { render, RenderResult, screen } from '@testing-library/react';
import LiveUnitMapIcon, { dataTestids } from '.';

function renderLiveUnitMapIcon(): RenderResult {
  return render(<LiveUnitMapIcon active highlighted={false} />);
}

describe('LiveUnitMapIcon', () => {
  it('Should render component successfully.', () => {
    try {
      renderLiveUnitMapIcon();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
