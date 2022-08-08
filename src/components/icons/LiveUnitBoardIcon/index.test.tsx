import { render, RenderResult, screen } from '@testing-library/react';
import LiveUnitBoardIcon, { dataTestids } from '.';

function renderLiveUnitBoardIcon(): RenderResult {
  return render(<LiveUnitBoardIcon active highlighted={false} />);
}

describe('LiveUnitBoardIcon', () => {
  it('Should render component successfully.', () => {
    try {
      renderLiveUnitBoardIcon();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
