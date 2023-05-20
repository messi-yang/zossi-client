import { useContext } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { AuthContext } from '@/contexts/auth-context';
import { Text } from '@/components/texts/text';
import { Button } from '@/components/buttons/button';

const Page: NextPage = function Page() {
  const { goToGoogleOauthPage } = useContext(AuthContext);

  const handleGoogleLoginClick = () => {
    goToGoogleOauthPage();
  };

  return (
    <main className="relative w-screen h-screen flex justify-center items-center bg-[#1E1E1E]">
      <div className="flex flex-col items-center">
        <Text color="text-white">Welcome to us!</Text>
        <div className="mt-5">
          <Button text="Continue with Google" onClick={handleGoogleLoginClick} />
        </div>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
