import { render, RenderResult, screen } from '@testing-library/react';
import { UnitPatternVO } from '@/valueObjects';
import EditUnitPatternModal, { dataTestids } from '.';

function renderEditUnitPatternModal(): RenderResult {
  return render(<EditUnitPatternModal opened unitPattern={new UnitPatternVO([[]])} />);
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
