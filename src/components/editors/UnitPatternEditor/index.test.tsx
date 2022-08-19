import { render, RenderResult, screen } from '@testing-library/react';
import UnitPatternEditor, { dataTestids } from '.';

function renderUnitPatternEditor(): RenderResult {
  return render(
    <UnitPatternEditor
      unitPattern={[
        [true, true, true],
        [true, null, true],
        [true, true, true],
      ]}
      onUpdate={() => {}}
    />
  );
}

describe('UnitPatternEditor', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitPatternEditor();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
