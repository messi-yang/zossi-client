import { render, RenderResult, screen } from '@testing-library/react';
import UnitPatternIcon, { dataTestids } from '.';

function renderUnitPatternIcon(): RenderResult {
  return render(<UnitPatternIcon active highlighted={false} />);
}

describe('UnitPatternIcon', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitPatternIcon();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
