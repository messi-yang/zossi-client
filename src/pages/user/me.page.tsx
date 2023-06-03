import { useContext } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { UserContext } from '@/contexts/user-context';
import { Text } from '@/components/texts/text';

const Page: NextPage = function Page() {
  const { user } = useContext(UserContext);

  return (
    <DashboardLayout>
      <main className="relative w-full h-full flex justify-center items-center bg-[#1E1E1E]">
        <div className="flex flex-col items-center">
          <Text color="text-white" size="text-base">
            {user?.getEmailAddress() || ''}
          </Text>
          <Text color="text-white" size="text-base">
            {user?.getUsername() || ''}
          </Text>
        </div>
      </main>
    </DashboardLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
