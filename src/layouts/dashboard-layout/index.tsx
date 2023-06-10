import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from '@/components/buttons/button';
import { AuthContext } from '@/contexts/auth-context';
import { Text } from '@/components/texts/text';

type Props = {
  children: JSX.Element;
};

export function DashboardLayout({ children }: Props) {
  const { singedIn, signOut } = useContext(AuthContext);
  const { goToGoogleOauthPage } = useContext(AuthContext);
  const router = useRouter();

  const handleGoogleLoginClick = () => {
    goToGoogleOauthPage(router.asPath);
  };
  console.log(router);

  if (!singedIn) {
    return (
      <main className="relative w-full h-screen flex justify-center items-center bg-[#1E1E1E]">
        <div className="flex flex-col items-center">
          <Text color="text-white" size="text-base">
            Please login to continue on this page
          </Text>
          <div className="mt-5">
            <Button
              text="Continue with"
              onClick={handleGoogleLoginClick}
              rightChild={<Image src="/assets/images/third-party/google.png" alt="google" width={71} height={24} />}
            />
          </div>
        </div>
      </main>
    );
  }

  const handleLogoutClick = () => {
    signOut();
  };

  return (
    <div className="h-screen flex flex-row">
      <div className="bg-stone-800 basis-40 shrink-0 h-full flex flex-col">
        <div className="grow p-5 flex flex-col">
          <Link href="/dashboard/world/my-worlds">
            <Button text="Worlds" fullWidth />
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
