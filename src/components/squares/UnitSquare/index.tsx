import { useRef, useCallback } from 'react';

import useHover from '@/hooks/useHover';
import styles from './styles';
import dataTestids from './dataTestids';

type Props = {
  coordinateX: number;
  coordinateY: number;
  alive: boolean;
  hovered: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick: (coordinateX: number, coordinateY: number) => any;
  onHover: (coordinateX: number, coordinateY: number) => any;
};

export default function UnitSquare({
  coordinateX,
  coordinateY,
  alive,
  hovered,
  hasTopBorder,
  hasRightBorder,
  hasBottomBorder,
  hasLeftBorder,
  onClick = () => {},
  onHover = () => {},
}: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const onHoverStateChange = useCallback(
    (newHovered) => {
      if (!newHovered) {
        return;
      }
      onHover(coordinateX, coordinateY);
    },
    [alive, coordinateX, coordinateY]
  );
  useHover(nodeRef, onHoverStateChange);

  let backgroundColor;
  if (hovered) {
    backgroundColor = alive ? styles.aliveHoverColor : styles.deadHoverColor;
  } else {
    backgroundColor = alive
      ? styles.aliveBackgroundColor
      : styles.deadBackgroundColor;
  }

  return (
    <div
      data-testid={dataTestids.root}
      ref={nodeRef}
      role="button"
      tabIndex={0}
      aria-label="game unit box"
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor,
        border: `1px solid ${styles.deadHoverColor}`,
        borderTop: hasTopBorder ? `1px solid ${styles.borderColor}` : '',
        borderRight: hasRightBorder ? `1px solid ${styles.borderColor}` : '',
        borderBottom: hasBottomBorder ? `1px solid ${styles.borderColor}` : '',
        borderLeft: hasLeftBorder ? `1px solid ${styles.borderColor}` : '',
      }}
      onClick={() => onClick(coordinateX, coordinateY)}
      onKeyDown={() => onClick(coordinateX, coordinateY)}
    />
  );
}
