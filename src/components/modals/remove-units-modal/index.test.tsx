import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { RemoveUnitsModal } from '.';

function renderRemoveUnitsModal(): RenderResult {
  return render(<RemoveUnitsModal opened onComfirm={() => {}} onCancel={() => {}} />);
}

describe('RemoveUnitsModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderRemoveUnitsModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
