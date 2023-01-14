import { createRef, MutableRefObject } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useDomRect from './index';

function createElementRef(): MutableRefObject<HTMLDivElement | null> {
  const ref: MutableRefObject<HTMLDivElement | null> = createRef();
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

  ref.current = div;

  return ref;
}

describe('useDomRect', () => {
  it('Should return document rect with desired values', () => {
    const elementRef = createElementRef();
    const { result, rerender } = renderHook(() => useDomRect(elementRef));
    rerender();
    if (!result.current) {
      expect(true).toBeFalsy();
      return;
    }

    expect(result.current.width).toEqual(100);
    expect(result.current.height).toEqual(100);
  });
});
