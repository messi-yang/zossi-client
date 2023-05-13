import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './dataTestids';
import { ConfirmModal } from '.';

function renderConfirmModal(): RenderResult {
  return render(<ConfirmModal opened message="Hello~~" buttonCopy="Confirm" onComfirm={() => {}} />);
}

describe('ConfirmModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderConfirmModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
