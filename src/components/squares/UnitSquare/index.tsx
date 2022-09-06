import { gameBackgroundColor } from '@/styles/colors';
import dataTestids from './dataTestids';

const styles = {
  aliveBackgroundColor: 'white',
  deadBackgroundColor: gameBackgroundColor,
  aliveHoverColor: 'rgb(200, 200, 200)',
  deadHoverColor: 'rgb(77, 77, 77)',
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
  borderColor?: string;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
};

function UnitSquare({
  alive,
  highlighted,
  borderColor = 'rgba(20,20,20)',
  hasTopBorder,
  hasRightBorder,
  hasBottomBorder,
  hasLeftBorder,
  onClick = () => {},
  onMouseEnter = () => {},
}: Props) {
  const backgroundColor = generateBackgroundColor(highlighted, alive);

  return (
    <div
      data-testid={dataTestids.root}
      role="button"
      tabIndex={0}
      aria-label="game unit box"
      className="w-full h-full box-border cursor-pointer"
      style={{
        backgroundColor,
        border: `1px solid ${styles.deadHoverColor}`,
        borderTop: hasTopBorder ? `1px solid ${borderColor}` : '',
        borderRight: hasRightBorder ? `1px solid ${borderColor}` : '',
        borderBottom: hasBottomBorder ? `1px solid ${borderColor}` : '',
        borderLeft: hasLeftBorder ? `1px solid ${borderColor}` : '',
      }}
      onClick={onClick}
      onKeyDown={onClick}
      onMouseEnter={onMouseEnter}
    />
  );
}

export default UnitSquare;
export { dataTestids };
