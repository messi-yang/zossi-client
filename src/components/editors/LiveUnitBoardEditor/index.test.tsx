import { render, RenderResult, screen } from '@testing-library/react';
import LiveUnitBoardEditor, { dataTestids } from '.';

function renderLiveUnitBoardEditor(): RenderResult {
  return render(
    <LiveUnitBoardEditor
      liveUnitBoard={[
        [true, true, true],
        [true, false, true],
        [true, true, true],
      ]}
      onUpdate={() => {}}
    />
  );
}

describe('LiveUnitBoardEditor', () => {
  it('Should render component successfully.', () => {
    try {
      renderLiveUnitBoardEditor();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
