import { useContext } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/avatars/user-avatar';
import { UserContext } from '@/contexts/user-context';
import { Text } from '@/components/texts/text';

type Props = {
  panel: React.ReactNode;
  children: React.ReactNode;
};

export function DashboardLayout({ panel, children }: Props) {
  const { user } = useContext(UserContext);

  return (
    <div className="h-screen flex flex-col bg-stone-900 p-5 gap-5">
      <div className="w-full h-12 flex gap-6">
        <div className="w-48">
          <Link href="/dashboard/account/profile" className="flex flex-row items-center gap-2 overflow-hidden">
            <div>{user && <UserAvatar user={user} />}</div>
            <Text>{user?.getUsername() ?? null}</Text>
          </Link>
        </div>
        <div className="flex-grow h-full">{panel}</div>
      </div>
      <div className="flex-grow flex gap-6">
        <div className="w-48 h-full flex flex-col shadow-xl">
          <div className="h-full rounded-3xl bg-stone-800 p-5 flex flex-col items-center">
            <Link href="/dashboard/worlds">
              <Text>My worlds</Text>
            </Link>
          </div>
        </div>
        <div className="grow h-fulloverflow-auto">
          <div className="mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
