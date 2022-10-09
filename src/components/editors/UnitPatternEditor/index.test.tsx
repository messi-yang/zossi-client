import { render, RenderResult, screen } from '@testing-library/react';
import { createUnitPattern } from '@/valueObjects/factories';
import UnitPatternEditor, { dataTestids } from '.';

function renderUnitPatternEditor(): RenderResult {
  return render(
    <UnitPatternEditor
      unitSize={20}
      unitPattern={createUnitPattern([
        [true, true, true],
        [true, false, true],
        [true, true, true],
      ])}
      editable
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
