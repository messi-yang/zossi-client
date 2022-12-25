import { renderHook } from '@testing-library/react-hooks';
import useResolutionCalculator from './index';

describe('useResolutionCalculator', () => {
  it('Should calculate resolution correctly', () => {
    const { result } = renderHook(() => useResolutionCalculator({ width: 111, height: 111 }, 10));

    expect(result.current).toEqual([12, 12]);
  });
});
