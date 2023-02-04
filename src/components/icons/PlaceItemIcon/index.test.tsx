import { render, RenderResult, screen } from '@testing-library/react';
import PlaceItemIcon, { dataTestids } from '.';

function renderPlaceItemIcon(): RenderResult {
  return render(<PlaceItemIcon active highlighted={false} />);
}

describe('PlaceItemIcon', () => {
  it('Should render component successfully.', () => {
    try {
      renderPlaceItemIcon();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
