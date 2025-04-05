import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { CreateSignUnitModal } from '.';

function renderCreateSignUnitModal(): RenderResult {
  return render(<CreateSignUnitModal opened onConfirm={() => {}} onCancel={() => {}} />);
}

describe('CreateWorldModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderCreateSignUnitModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
