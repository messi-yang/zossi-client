import classnames from 'classnames';
import { WorldMemberModel } from '@/models';
import { Text } from '@/components/texts/text';
import { dataTestids } from './data-test-ids';
import { UserAvatar } from '@/components/avatars/user-avatar';

type Props = {
  worldMember: WorldMemberModel;
};

export function WorldMemberCard({ worldMember }: Props) {
  return (
    <div
      data-testid={dataTestids.root}
      className={classnames('relative', 'w-full', 'p-2', 'flex', 'flex-row', 'items-center')}
    >
      <div className="grow flex flex-row items-center">
        <UserAvatar size="small" user={worldMember.getUser()} />
        <div className="ml-2">
          <Text>{worldMember.getUser().getUsername()}</Text>
        </div>
      </div>
      <div className="ml-2">
        <Text>{worldMember.getWorldRole().toString()}</Text>
      </div>
    </div>
  );
}
