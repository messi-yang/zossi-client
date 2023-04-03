import dataTestids from './dataTestids';

type Props = {
  copy?: string;
  color?: string;
  size?: number;
  lineHeight?: number;
  weight?: 'regular' | 'bold';
};

function Text({ copy = '', color = 'black', size = 16, lineHeight = 1.2, weight = 'regular' }: Props) {
  return (
    <span
      data-testid={dataTestids.root}
      className={[weight === 'regular' ? 'font-normal' : 'font-bold', 'font-silkscreen', 'tracking-tightest'].join(' ')}
      style={{
        color,
        fontSize: size,
        lineHeight,
      }}
    >
      {copy}
    </span>
  );
}

export default Text;
export { dataTestids };
