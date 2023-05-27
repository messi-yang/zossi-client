import { useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { QueryWorldsContext } from '@/contexts/query-worlds-context';
import { AuthContext } from '@/contexts/auth-context';
import { Button } from '@/components/buttons/button';

const Landing: NextPage = function Landing() {
  const { worlds, queryWorlds } = useContext(QueryWorldsContext);
  const { singedIn, signOut } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    queryWorlds();
  }, []);

  const onStartClick = () => {
    if (!worlds) return;

    const worldId = worlds[0].getId() as string | null;
    if (!worldId) return;

    router.push(`/worlds/${worldId}`);
  };

  const handleLogOutClick = () => {
    signOut();
  };

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
      <div className="absolute top-0 left-0 w-full h-20 px-16 flex justify-between items-center">
        <Image src="/assets/images/logos/wordmark-logo.png" alt="wordmark logo" width={270} height={21} />
        <div>
          {singedIn ? (
            <Button text="Log Out" onClick={handleLogOutClick} />
          ) : (
            <Link href="auth/sign-in" className="flex items-center">
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
      <div className="mt-8 sm:mt-20">
        <Button text="Start" onClick={onStartClick} />
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Landing;
