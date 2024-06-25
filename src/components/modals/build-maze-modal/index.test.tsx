import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { BuildMazeModal } from '.';

function renderBuildMazeModal(): RenderResult {
  return render(<BuildMazeModal opened items={[]} onComfirm={() => {}} onCancel={() => {}} />);
}

describe('BuildMazeModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderBuildMazeModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
