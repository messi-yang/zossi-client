import classnames from 'classnames';
import { WorldModel } from '@/models';
import { Text } from '@/components/texts/text';
import { dataTestids } from './data-test-ids';

type Props = {
  world: WorldModel;
};

export function WorldCard({ world }: Props) {
  return (
    <div
      data-testid={dataTestids.root}
      className={classnames('flex', 'flex-col', 'p-5', 'bg-black', 'border', 'border-white', 'rounded-lg')}
    >
      <Text>{world.getName()}</Text>
      <div className={classnames('mt-2')}>
        <Text>{world.getUserId()}</Text>
      </div>
    </div>
  );
}
