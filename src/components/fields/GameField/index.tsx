import Field from './Field';
import { Units } from './types';

type Props = {
  units: Units;
  unitSize: number;
};

function GameField({ units, unitSize }: Props) {
  return (
    <section>
      <Field units={units} unitSize={unitSize} />
    </section>
  );
}

export default GameField;
export type { Units };
