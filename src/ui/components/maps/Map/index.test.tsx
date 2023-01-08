import { render, RenderResult, screen } from '@testing-library/react';
import Map, { dataTestids } from '.';
import { UnitVo, MapVo, OffsetVo } from '@/models/valueObjects';

function renderMap(map: MapVo): RenderResult {
  return render(
    <Map
      range={null}
      rangeOffset={OffsetVo.new(0, 0)}
      map={map}
      unitSize={30}
      items={[]}
      selectedItemId={null}
      onUnitClick={() => {}}
    />
  );
}

describe('Map', () => {
  it('Should render component successfully.', () => {
    try {
      const unitMatrix = [[UnitVo.new(null)]];
      renderMap(MapVo.new(unitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
