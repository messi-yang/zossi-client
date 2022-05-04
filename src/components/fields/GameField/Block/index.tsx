import { useRef } from 'react';

import useHover from '@/hooks/useHover';
import type { Unit, Coordinate } from '../types';

type Props = {
  unit: Unit;
  size: number;
  onClick: (coordinate: Coordinate) => any;
};

export default function Block({ unit, size, onClick }: Props) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const [hovered] = useHover(nodeRef);

  let backgroundColor;
  if (hovered) {
    backgroundColor = 'red';
  } else {
    backgroundColor = unit.alive ? 'white' : 'black';
  }

  return (
    <button
      ref={nodeRef}
      type="button"
      aria-label="game block"
      style={{ width: `${size}px`, height: `${size}px`, backgroundColor }}
      onClick={() => onClick(unit.coordinate)}
    />
  );
}
