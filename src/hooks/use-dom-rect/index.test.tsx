import { renderHook } from '@testing-library/react';
import { useDomRect } from './index';

function createDivElement(): HTMLDivElement {
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
    const divElement = createDivElement();
    const { result, rerender } = renderHook(() => useDomRect(divElement));
    rerender();
    if (!result.current) {
      expect(true).toBeFalsy();
      return;
    }

    expect(result.current.width).toEqual(100);
    expect(result.current.height).toEqual(100);
  });
});
