import { render, RenderResult, screen } from '@testing-library/react';
import { UnitPatternVO, MapSizeVO } from '@/valueObjects';
import { generateEmptyUnitMapWithMapSize } from '@/valueObjects/factories';
import UnitMapCanvas, { dataTestids } from '.';

function renderUnitMapCanvas(): RenderResult {
  return render(
    <UnitMapCanvas
      unitMap={generateEmptyUnitMapWithMapSize(new MapSizeVO(1, 1))}
      unitSize={20}
      unitPattern={new UnitPatternVO([[true]])}
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
