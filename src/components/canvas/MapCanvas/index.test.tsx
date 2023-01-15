import { render, RenderResult, screen } from '@testing-library/react';
import MapCanvas, { dataTestids } from '.';
import { SizeVo, MapVo } from '@/models/valueObjects';

function renderMapCanvas(): RenderResult {
  return render(
    <MapCanvas
      map={MapVo.newWithSize(SizeVo.new(1, 1))}
      unitSize={20}
      onClick={() => {}}
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
