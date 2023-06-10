import { useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/buttons/button';
import { AuthContext } from '@/contexts/auth-context';

type Props = {
  children: JSX.Element;
};

export function DashboardLayout({ children }: Props) {
  const { signOut } = useContext(AuthContext);
  const handleLogoutClick = () => {
    signOut();
  };

  return (
    <div className="h-screen flex flex-row">
      <div className="bg-stone-800 basis-60 shrink-0 h-full flex flex-col">
        <div className="grow p-5 flex flex-col">
          <Link href="/dashboard/worlds">
            <Button text="My worlds" fullWidth />
          </Link>
          <Link href="/dashboard/account/profile" className="mt-3">
            <Button text="Profile" fullWidth />
          </Link>
        </div>
        <div className="shrink-0 p-5 flex flex-col">
          <Button text="Logout" onClick={handleLogoutClick} />
        </div>
      </div>
      <div className="grow h-full">{children}</div>
    </div>
  );
}
