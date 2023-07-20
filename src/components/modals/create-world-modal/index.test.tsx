import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { CreateWorldModal } from '.';

function renderCreateWorldModal(): RenderResult {
  return render(<CreateWorldModal opened onConfirm={() => {}} onCancel={() => {}} />);
}

describe('CreateWorldModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderCreateWorldModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
