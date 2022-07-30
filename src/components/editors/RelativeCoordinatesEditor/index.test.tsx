import { render, RenderResult, screen } from '@testing-library/react';
import RelativeCoordinatesEditor from '.';
import dataTestids from './dataTestids';

function renderRelativeCoordinatesEditor(): RenderResult {
  return render(
    <RelativeCoordinatesEditor
      relativeCoordinates={[{ x: 0, y: 0 }]}
      relativeCoordinateOffset={{ x: 0, y: 0 }}
      width={1}
      height={1}
      onUpdate={() => {}}
    />
  );
}

describe('RelativeCoordinatesEditor', () => {
  it('Should render component successfully.', () => {
    try {
      renderRelativeCoordinatesEditor();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
