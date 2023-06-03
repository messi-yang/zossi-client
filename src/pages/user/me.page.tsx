import { useContext } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { UserContext } from '@/contexts/user-context';
import { Text } from '@/components/texts/text';

const Page: NextPage = function Page() {
  const { user } = useContext(UserContext);

  return (
    <main className="relative w-screen h-screen flex justify-center items-center bg-[#1E1E1E]">
      <div className="flex flex-col items-center">
        <Text color="text-white" size="text-base">
          {user?.getEmailAddress() || ''}
        </Text>
        <Text color="text-white" size="text-base">
          {user?.getUsername() || ''}
        </Text>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
