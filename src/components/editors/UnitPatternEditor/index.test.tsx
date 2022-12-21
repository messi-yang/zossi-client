import { render, RenderResult, screen } from '@testing-library/react';
import { createUnitPattern } from '@/models/valueObjects/factories';
import UnitPatternEditor, { dataTestids } from '.';

function renderUnitPatternEditor(): RenderResult {
  return render(
    <UnitPatternEditor
      unitSize={20}
      unitPattern={createUnitPattern([
        [false, false, false, false],
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
        [false, false, false, false],
      ])}
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
