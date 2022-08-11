import { render, RenderResult, screen } from '@testing-library/react';
import LiveUnitMapEditor, { dataTestids } from '.';

function renderLiveUnitMapEditor(): RenderResult {
  return render(
    <LiveUnitMapEditor
      liveUnitMap={[
        [true, true, true],
        [true, null, true],
        [true, true, true],
      ]}
      onUpdate={() => {}}
    />
  );
}

describe('LiveUnitMapEditor', () => {
  it('Should render component successfully.', () => {
    try {
      renderLiveUnitMapEditor();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
