import { render, RenderResult, screen } from '@testing-library/react';
import Map, { dataTestids } from '.';
import { UnitVo, MapVo, ViewVo, OffsetVo, BoundVo, LocationVo } from '@/models/valueObjects';

function renderMap(map: MapVo): RenderResult {
  return render(
    <Map
      view={ViewVo.new(BoundVo.new(LocationVo.new(0, 0), LocationVo.new(10, 10)), map)}
      viewOffset={OffsetVo.new(0, 0)}
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
