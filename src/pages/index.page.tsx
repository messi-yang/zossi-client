import { useContext } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { AuthContext } from '@/contexts/auth-context';
import { Button } from '@/components/buttons/button';

const Page: NextPage = function Page() {
  const { singedIn, signOut } = useContext(AuthContext);

  const handleLogOutClick = () => {
    signOut();
  };

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
      <div className="absolute top-0 left-0 w-full h-20 px-16 flex justify-between items-center">
        <Image src="/assets/images/logos/wordmark-logo.png" alt="wordmark logo" width={270} height={21} />
        <div>
          {singedIn ? (
            <div className="grid grid-flow-col gap-3">
              <Link href="/dashboard/account/profile" className="flex items-center">
                <Button text="Profile" />
              </Link>
              <Button text="Log Out" onClick={handleLogOutClick} />
            </div>
          ) : (
            <Link href="/auth/sign-in" className="flex items-center">
              <Button text="Log In" />
            </Link>
          )}
        </div>
      </div>
      <div className="sm:hidden">
        <Image src="/assets/images/logos/big-logo.png" alt="big logo" width={203} height={150} />
      </div>
      <div className="hidden sm:inline-block">
        <Image src="/assets/images/logos/big-logo.png" alt="big logo" width={406} height={231} />
      </div>
      <div className="mt-8 sm:mt-20 flex flex-col items-center">
        <div className="mt-4">
          <Link href="/dashboard/worlds">
            <Button text="Browse Worlds" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
