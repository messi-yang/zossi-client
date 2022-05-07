import { createRef, MutableRefObject } from 'react';
import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useHover from './index';

function createElementRef(): MutableRefObject<HTMLElement | null> {
  const ref: MutableRefObject<HTMLElement | null> = createRef();
  const div = document.createElement('div');
  ref.current = div;

  return ref;
}

describe('useHover', () => {
  it('Should trigger callback with "hovered = true" when referrenced element is hovered', () => {
    const ref = createElementRef();
    if (!ref.current) {
      throw Error('');
    }

    const callbackMockup = jest.fn();
    renderHook(() => useHover(ref, callbackMockup));

    fireEvent.mouseOver(ref.current);

    expect(callbackMockup.mock.calls.length).toBe(1);
    expect(callbackMockup.mock.calls[0][0]).toBe(true);
  });
  it('Should trigger callback with "hovered = false" when referrenced element is un-hovered', () => {
    const ref = createElementRef();
    if (!ref.current) {
      throw Error('');
    }

    const callbackMockup = jest.fn();
    renderHook(() => useHover(ref, callbackMockup));

    fireEvent.mouseLeave(ref.current);

    expect(callbackMockup.mock.calls[0][0]).toBe(false);
  });
});
