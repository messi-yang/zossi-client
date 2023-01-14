import { render, RenderResult, screen } from '@testing-library/react';
import ConfirmModal, { dataTestids } from '.';

function renderConfirmModal(): RenderResult {
  return render(<ConfirmModal opened buttonCopy="Confirm" onComfirm={() => {}} />);
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
