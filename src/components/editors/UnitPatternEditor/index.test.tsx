import { render, RenderResult, screen } from '@testing-library/react';
import { UnitPatternValueObject } from '@/valueObjects';
import UnitPatternEditor, { dataTestids } from '.';

function renderUnitPatternEditor(): RenderResult {
  return render(
    <UnitPatternEditor
      unitSize={20}
      unitPattern={
        new UnitPatternValueObject([
          [true, true, true],
          [true, false, true],
          [true, true, true],
        ])
      }
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
