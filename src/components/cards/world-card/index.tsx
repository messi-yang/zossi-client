import classnames from 'classnames';
import { WorldModel } from '@/models';
import { Text } from '@/components/texts/text';
import { IconButton } from '@/components/buttons/icon-button';
import { UserAvatar } from '@/components/avatars/user-avatar';
import { dataTestids } from './data-test-ids';

type Props = {
  world: WorldModel;
  deleting?: boolean;
  onDeleteClick?: () => void;
};

export function WorldCard({ world, deleting = false, onDeleteClick = () => {} }: Props) {
  return (
    <div
      data-testid={dataTestids.root}
      className={classnames(
        'relative',
        'bg-black',
        deleting && 'opacity-30',
        'border',
        'border-white',
        'rounded-lg',
        deleting && 'pointer-events-none'
      )}
    >
      <div className={classnames('absolute', 'top-2', 'right-2', 'inline-flex')}>
        <IconButton icon="cross" onClick={onDeleteClick} />
      </div>
      <div className={classnames('flex', 'flex-col', 'p-5')}>
        <Text>{world.getName()}</Text>
        <div className={classnames('mt-2', 'flex', 'flex-row', 'items-center')}>
          <UserAvatar user={world.getUser()} />
          <div className="ml-2">
            <Text>{world.getUser().getUsername()}</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
