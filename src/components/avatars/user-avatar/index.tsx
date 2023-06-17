import { UserModel } from '@/models';
import { dataTestids } from './data-test-ids';

type Props = {
  user: UserModel;
  onClick?: () => void;
};

export function UserAvatar({ user, onClick }: Props) {
  return (
    <button
      type="button"
      data-testid={dataTestids.root}
      className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-500 text-white cursor-pointer"
      onClick={onClick}
    >
      {user.getInitials()}
    </button>
  );
}
