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
      style={{
        fontFamily: '"Silkscreen", cursive',
        fontWeight: weight === 'regular' ? 400 : 700,
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
