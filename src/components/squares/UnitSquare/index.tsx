import { useRef, useCallback } from 'react';

import useHover from '@/hooks/useHover';
import dataTestids from './dataTestids';

const styles = {
  aliveBackgroundColor: 'white',
  deadBackgroundColor: 'black',
  aliveHoverColor: 'rgb(200, 200, 200)',
  deadHoverColor: 'rgb(77, 77, 77)',
  borderColor: 'rgb(20, 20, 20)',
};

const generateBackgroundColor = (
  highlighted: boolean,
  alive: boolean
): string => {
  if (highlighted) {
    return alive ? styles.aliveHoverColor : styles.deadHoverColor;
  }
  return alive ? styles.aliveBackgroundColor : styles.deadBackgroundColor;
};

type Props = {
  x: number;
  y: number;
  alive: boolean;
  highlighted: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick?: (x: number, y: number) => any;
  onHover?: (x: number, y: number) => any;
};

function UnitSquare({
  x,
  y,
  alive,
  highlighted,
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
      onHover(x, y);
    },
    [alive, x, y]
  );
  useHover(nodeRef, handleHoverStateChange);

  const handleSquareClick = () => onClick(x, y);
  const handleSquareKeyDown = handleSquareClick;

  const backgroundColor = generateBackgroundColor(highlighted, alive);

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
        borderTop: hasTopBorder ? `1px solid ${styles.borderColor}` : '',
        borderRight: hasRightBorder ? `1px solid ${styles.borderColor}` : '',
        borderBottom: hasBottomBorder ? `1px solid ${styles.borderColor}` : '',
        borderLeft: hasLeftBorder ? `1px solid ${styles.borderColor}` : '',
      }}
      onClick={handleSquareClick}
      onKeyDown={handleSquareKeyDown}
    />
  );
}

export default UnitSquare;
export { dataTestids };
