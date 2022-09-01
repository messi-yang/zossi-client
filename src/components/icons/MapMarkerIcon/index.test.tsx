import { render, RenderResult, screen } from '@testing-library/react';
import MapMarkerIcon, { dataTestids } from '.';

function renderMapMarkerIcon(): RenderResult {
  return render(<MapMarkerIcon active highlighted={false} />);
}

describe('MapMarkerIcon', () => {
  it('Should render component successfully.', () => {
    try {
      renderMapMarkerIcon();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
