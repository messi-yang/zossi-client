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
      className="w-100 h-100 box-border cursor-pointer border border-solid"
      style={{
        backgroundColor,
        borderColor: styles.deadHoverColor,
        borderTopColor: hasTopBorder ? borderColor : undefined,
        borderRightColor: hasRightBorder ? borderColor : undefined,
        borderBottomColor: hasBottomBorder ? borderColor : undefined,
        borderLeftColor: hasLeftBorder ? borderColor : undefined,
      }}
      onClick={onClick}
      onKeyDown={onClick}
      onMouseEnter={onMouseEnter}
    />
  );
}

export default UnitSquare;
export { dataTestids };
