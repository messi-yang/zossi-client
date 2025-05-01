import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { WorldBottomPanel } from '.';

function renderWorldBottomPanel(): RenderResult {
  return render(
    <WorldBottomPanel
      selectedItem={null}
      onMoveClick={() => {}}
      onCameraClick={() => {}}
      onRotateSelectedItemClick={() => {}}
      onBuildClick={() => {}}
      onReplayClick={() => {}}
    />
  );
}

describe('WorldBottomPanel', () => {
  it('Should render component successfully.', () => {
    try {
      renderWorldBottomPanel();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
