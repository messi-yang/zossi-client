import Field from './Field';
import { Units } from './types';

type Props = {
  units: Units;
};

function GameField({ units }: Props) {
  return (
    <section>
      <Field units={units} />
    </section>
  );
}

export default GameField;
export type { Units };
