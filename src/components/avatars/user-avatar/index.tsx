import classnames from 'classnames';
import { UserModel } from '@/models';
import { dataTestids } from './data-test-ids';
import { Text } from '@/components/texts/text';

type Props = {
  user: UserModel;
  size?: 'large' | 'small';
  onClick?: () => void;
};

export function UserAvatar({ user, size = 'large', onClick }: Props) {
  return (
    <button
      type="button"
      data-testid={dataTestids.root}
      className={classnames(
        size === 'large' ? 'w-12' : 'w-6',
        size === 'large' ? 'h-12' : 'h-6',
        'rounded-full',
        'flex',
        'items-center',
        'justify-center',
        'bg-orange-500',
        'text-white',
        'cursor-pointer'
      )}
      onClick={onClick}
    >
      <Text size={size === 'large' ? 'text-lg' : 'text-xs'}>{user.getInitials()}</Text>
    </button>
  );
}
