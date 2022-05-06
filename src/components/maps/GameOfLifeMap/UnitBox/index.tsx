import { useRef, useCallback } from 'react';

import useHover from '@/hooks/useHover';
import type { Unit, Coordinate } from '../types';
import styles from '../styles';

type Props = {
  unit: Unit;
  toBeRevived: boolean;
  hasBorder: boolean;
  onClick: (coordinate: Coordinate) => any;
  onHover: (coordinate: Coordinate) => any;
};

export default function UnitBox({
  unit,
  toBeRevived,
  hasBorder,
  onClick,
  onHover,
}: Props) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const onHoverStateChange = useCallback(
    (newHovered) => {
      if (newHovered) {
        onHover(unit.coordinate);
      }
    },
    [unit]
  );
  useHover(nodeRef, onHoverStateChange);

  let backgroundColor;
  if (toBeRevived) {
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
