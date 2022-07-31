import { useRef, useCallback } from 'react';

import useHover from '@/hooks/useHover';
import styles from './styles';
import dataTestids from './dataTestids';

type Props = {
  coordinateX: number;
  coordinateY: number;
  alive: boolean;
  highlighted: boolean;
  borderColor?: string;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick?: (coordinateX: number, coordinateY: number) => any;
  onHover?: (coordinateX: number, coordinateY: number) => any;
};

function UnitSquare({
  coordinateX,
  coordinateY,
  alive,
  highlighted,
  borderColor = 'rgb(20, 20, 20)',
  hasTopBorder,
  hasRightBorder,
  hasBottomBorder,
  hasLeftBorder,
  onClick = () => {},
  onHover = () => {},
}: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const handleHoverStateChange = useCallback(
    (newHovered) => {
      if (!newHovered) {
        return;
      }
      onHover(coordinateX, coordinateY);
    },
    [alive, coordinateX, coordinateY]
  );
  useHover(nodeRef, handleHoverStateChange);

  const handleSquareClick = () => onClick(coordinateX, coordinateY);
  const handleSquareKeyDown = handleSquareClick;

  let backgroundColor;
  if (highlighted) {
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
        cursor: 'pointer',
        backgroundColor,
        border: `1px solid ${styles.deadHoverColor}`,
        borderTop: hasTopBorder ? `1px solid ${borderColor}` : '',
        borderRight: hasRightBorder ? `1px solid ${borderColor}` : '',
        borderBottom: hasBottomBorder ? `1px solid ${borderColor}` : '',
        borderLeft: hasLeftBorder ? `1px solid ${borderColor}` : '',
      }}
      onClick={handleSquareClick}
      onKeyDown={handleSquareKeyDown}
    />
  );
}

export default UnitSquare;
export { dataTestids };
