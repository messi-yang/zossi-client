import { useRef } from 'react';

import useHover from '@/hooks/useHover';
import type { Unit, Coordinate } from '../types';
import styles from '../styles';

type Props = {
  unit: Unit;
  hasBorder: boolean;
  onClick: (coordinate: Coordinate) => any;
};

export default function UnitBox({ unit, hasBorder, onClick }: Props) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const [hovered] = useHover(nodeRef);

  let backgroundColor;
  if (hovered) {
    backgroundColor = unit.alive
      ? styles.aliveUnitBoxHoverColor
      : styles.deadUnitBoxHoverColor;
  } else {
    backgroundColor = unit.alive
      ? styles.aliveUnitBoxColor
      : styles.deadUnitBoxColor;
  }

  return (
    <section style={{ flexGrow: '1', display: 'flex' }}>
      <button
        ref={nodeRef}
        type="button"
        aria-label="game unit box"
        style={{
          flexGrow: '1',
          backgroundColor,
          borderBottom: hasBorder
            ? `1px solid ${styles.unitBoxBorderColor}`
            : '',
        }}
        onClick={() => onClick(unit.coordinate)}
      />
    </section>
  );
}
