import { gameBackgroundColor } from '@/styles/colors';
import dataTestids from './dataTestids';

const styles = {
  aliveBackgroundColor: 'white',
  deadBackgroundColor: gameBackgroundColor,
  aliveHoverColor: 'rgb(200, 200, 200)',
  deadHoverColor: 'rgb(77, 77, 77)',
  borderColor: 'rgb(20, 20, 20)',
};

const generateBackgroundColor = (highlighted: boolean, alive: boolean): string => {
  if (highlighted) {
    return alive ? styles.aliveHoverColor : styles.deadHoverColor;
  }
  return alive ? styles.aliveBackgroundColor : styles.deadBackgroundColor;
};

type Props = {
  alive: boolean;
  highlighted: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

function UnitSquare({
  alive,
  highlighted,
  hasTopBorder,
  hasRightBorder,
  hasBottomBorder,
  hasLeftBorder,
  onClick = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}: Props) {
  const backgroundColor = generateBackgroundColor(highlighted, alive);

  return (
    <div
      data-testid={dataTestids.root}
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
      onClick={onClick}
      onKeyDown={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

export default UnitSquare;
export { dataTestids };
