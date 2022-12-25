import { renderHook } from '@testing-library/react-hooks';
import useWindowSize from '.';

function setMockupWindowSize(width: number, height: number) {
  globalThis.innerWidth = width;
  globalThis.innerHeight = height;
}

describe('useWindowSize', () => {
  it('Should calculate resolution correctly', () => {
    const expectedWidth = 400;
    const expectedHeight = 300;
    setMockupWindowSize(expectedWidth, expectedHeight);

    const {
      result: {
        current: { width, height },
      },
    } = renderHook(() => useWindowSize());

    expect(width).toEqual(expectedWidth);
    expect(height).toEqual(expectedHeight);
  });
});
