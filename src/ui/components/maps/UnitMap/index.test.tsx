import { render, RenderResult, screen } from '@testing-library/react';
import UnitMap, { dataTestids } from '.';
import { MapUnitVo, UnitMapVo, OffsetVo } from '@/models/valueObjects';

function renderUnitMap(unitMap: UnitMapVo): RenderResult {
  return render(
    <UnitMap
      mapRange={null}
      mapRangeOffset={OffsetVo.new(0, 0)}
      unitMap={unitMap}
      mapUnitSize={30}
      items={[]}
      selectedItemId={null}
      onMapUnitClick={() => {}}
    />
  );
}

describe('UnitMap', () => {
  it('Should render component successfully.', () => {
    try {
      const mapUnitMatrix = [[MapUnitVo.new(null)]];
      renderUnitMap(UnitMapVo.new(mapUnitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
