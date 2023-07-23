import classnames from 'classnames';
import { WorldMemberModel } from '@/models';
import { Text } from '@/components/texts/text';
import { dataTestids } from './data-test-ids';

type Props = {
  worldMember: WorldMemberModel;
};

export function WorldMemberCard({ worldMember }: Props) {
  return (
    <div data-testid={dataTestids.root} className={classnames('relative', 'w-full', 'p-2')}>
      <Text>{worldMember.getWorldRole().toString()}</Text>
    </div>
  );
}
