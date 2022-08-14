import { render, RenderResult, screen } from '@testing-library/react';
import EditLiveUnitMapModal, { dataTestids } from '.';

function renderEditLiveUnitMapModal(): RenderResult {
  return render(<EditLiveUnitMapModal opened liveUnitMap={[]} />);
}

describe('EditLiveUnitMapModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderEditLiveUnitMapModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
