import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { MessageModal } from '.';

function renderMessageModal(): RenderResult {
  return render(<MessageModal opened message="Hello~~" buttonCopy="Confirm" onComfirm={() => {}} />);
}

describe('MessageModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderMessageModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
