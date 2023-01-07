import { render, RenderResult, screen } from '@testing-library/react';
import UnitMap, { dataTestids } from '.';
import { UnitVo, UnitMapVo, OffsetVo } from '@/models/valueObjects';

function renderUnitMap(unitMap: UnitMapVo): RenderResult {
  return render(
    <UnitMap
      mapRange={null}
      mapRangeOffset={OffsetVo.new(0, 0)}
      unitMap={unitMap}
      unitSize={30}
      items={[]}
      selectedItemId={null}
      onUnitClick={() => {}}
    />
  );
}

describe('UnitMap', () => {
  it('Should render component successfully.', () => {
    try {
      const unitMatrix = [[UnitVo.new(null)]];
      renderUnitMap(UnitMapVo.new(unitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
