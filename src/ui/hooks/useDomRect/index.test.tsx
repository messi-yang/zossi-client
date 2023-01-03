import { renderHook } from '@testing-library/react-hooks';
import useDomRect from './index';

function createElementRef(): HTMLDivElement {
  const div = document.createElement('div');
  jest.spyOn(div, 'getBoundingClientRect').mockImplementation(
    (): DOMRect => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 100,
      height: 100,
      toJSON: () => {},
    })
  );
  return div;
}

describe('useDomRect', () => {
  it('Should return document rect with desired values', () => {
    const { result, rerender } = renderHook(() => useDomRect());

    // @ts-ignore: attach ref to mockup div element
    result.current[0].current = createElementRef();

    rerender();

    const rect = result.current[1];
    if (!rect) {
      expect(true).toBeFalsy();
      return;
    }

    const { width, height } = rect;

    expect(width).toEqual(100);
    expect(height).toEqual(100);
  });
});
