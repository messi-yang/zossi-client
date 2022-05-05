import { useRef } from 'react';

import useHover from '@/hooks/useHover';
import type { Unit, Coordinate } from '../types';

type Props = {
  unit: Unit;
  onClick: (coordinate: Coordinate) => any;
};

export default function UnitBox({ unit, onClick }: Props) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const [hovered] = useHover(nodeRef);

  let backgroundColor;
  if (hovered) {
    backgroundColor = 'red';
  } else {
    backgroundColor = unit.alive ? 'white' : 'black';
  }

  return (
    <section style={{ flexGrow: '1', display: 'flex' }}>
      <button
        ref={nodeRef}
        type="button"
        aria-label="game unit box"
        style={{ flexGrow: '1', backgroundColor }}
        onClick={() => onClick(unit.coordinate)}
      />
    </section>
  );
}
