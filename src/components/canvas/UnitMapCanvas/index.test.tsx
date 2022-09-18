import { render, RenderResult, screen } from '@testing-library/react';
import { UnitPatternValueObject, MapSizeValueObject } from '@/valueObjects';
import { generateEmptyUnitMapWithMapSize } from '@/valueObjects/factories';
import UnitMapCanvas, { dataTestids } from '.';

function renderUnitMapCanvas(): RenderResult {
  return render(
    <UnitMapCanvas
      unitMap={generateEmptyUnitMapWithMapSize(new MapSizeValueObject(1, 1))}
      unitSize={20}
      unitPattern={new UnitPatternValueObject([[true]])}
      onClick={() => {}}
    />
  );
}

describe('UnitMapCanvas', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitMapCanvas();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
