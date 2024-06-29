import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { ReplayCommandsModal } from '.';

function renderReplayCommandsModal(): RenderResult {
  return render(<ReplayCommandsModal opened onComfirm={() => {}} onCancel={() => {}} />);
}

describe('ReplayCommandsModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderReplayCommandsModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
