import { render, RenderResult, screen } from '@testing-library/react';
import LiveUnitsBoardEditor, { dataTestids } from '.';

function renderLiveUnitsBoardEditor(): RenderResult {
  return render(
    <LiveUnitsBoardEditor
      liveUnitsBoard={[
        [true, true, true],
        [true, false, true],
        [true, true, true],
      ]}
      onUpdate={() => {}}
    />
  );
}

describe('LiveUnitsBoardEditor', () => {
  it('Should render component successfully.', () => {
    try {
      renderLiveUnitsBoardEditor();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
