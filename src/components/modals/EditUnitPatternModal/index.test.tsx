import { render, RenderResult, screen } from '@testing-library/react';
import { createUnitPattern } from '@/models/valueObjects/factories';
import EditUnitPatternModal, { dataTestids } from '.';

function renderEditUnitPatternModal(): RenderResult {
  return render(<EditUnitPatternModal opened width={100} unitPattern={createUnitPattern([[]])} />);
}

describe('EditUnitPatternModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderEditUnitPatternModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
