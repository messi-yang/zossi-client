import { useRef, useCallback } from 'react';

import useHover from '@/hooks/useHover';
import type { Unit } from '../types';
import styles from '../styles';
import dataTestidMap from '../dataTestid';

type Props = {
  coordinateX: number;
  coordinateY: number;
  unit: Unit;
  toBeRevived: boolean;
  hasBorder: boolean;
  onClick: (coordinateX: number, coordinateY: number) => any;
  onHover: (coordinateX: number, coordinateY: number) => any;
};

export default function UnitBox({
  coordinateX,
  coordinateY,
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
        onHover(coordinateX, coordinateY);
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
    <section
      data-testid={dataTestidMap.unitBox}
      style={{ flexGrow: '1', display: 'flex' }}
    >
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
        onClick={() => onClick(coordinateX, coordinateY)}
      />
    </section>
  );
}
