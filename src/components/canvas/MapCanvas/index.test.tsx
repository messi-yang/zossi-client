import { render, RenderResult, screen } from '@testing-library/react';
import MapCanvas, { dataTestids } from '.';
import { ViewVo, SizeVo, MapVo, OffsetVo, BoundVo, LocationVo } from '@/models/valueObjects';
import { PlayerEntity } from '@/models/entities';

function renderMapCanvas(): RenderResult {
  return render(
    <MapCanvas
      players={[
        PlayerEntity.new({
          id: '1',
          name: 'Mark',
          location: LocationVo.new(0, 0),
        }),
      ]}
      view={ViewVo.new(BoundVo.new(LocationVo.new(0, 0), LocationVo.new(4, 4)), MapVo.newWithMapSize(SizeVo.new(5, 5)))}
      viewOffset={OffsetVo.new(0, 0)}
      unitSize={20}
      onUnitClick={() => {}}
      items={[]}
      selectedItemId={null}
    />
  );
}

describe('MapCanvas', () => {
  it('Should render component successfully.', () => {
    try {
      renderMapCanvas();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
