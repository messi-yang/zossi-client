import dataTestids from './dataTestids';

type Props = {
  copy?: string;
  color?: string;
  size?: number;
  weight?: 'regular' | 'bold';
};

function Text({ copy = '', color = 'black', size = 16, weight = 'regular' }: Props) {
  return (
    <span
      data-testid={dataTestids.root}
      className={[weight === 'regular' ? 'font-normal' : 'font-bold', 'font-silkscreen'].join(' ')}
      style={{
        color,
        fontSize: size,
      }}
    >
      {copy}
    </span>
  );
}

export default Text;
export { dataTestids };
