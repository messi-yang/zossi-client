import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { Button } from '@/components/buttons/button';

const Page: NextPage = function Page() {
  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
      <div className="absolute top-0 left-0 w-full h-20 px-16 flex justify-end items-center">
        <div>
          <Link href="/auth/sign-in" className="flex items-center">
            <Button text="Log In" />
          </Link>
        </div>
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
