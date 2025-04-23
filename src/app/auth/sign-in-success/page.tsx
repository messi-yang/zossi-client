'use client';

import { useContext, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/contexts/auth-context';
import { Text } from '@/components/texts/text';

const Page = function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const oauthClientRedirectPath = searchParams.get('client_redirect_path');

  const { signIn } = useContext(AuthContext);
  useEffect(() => {
    if (!accessToken || !oauthClientRedirectPath) {
      return;
    }
    signIn(accessToken);
    router.push(oauthClientRedirectPath);
  }, [accessToken, oauthClientRedirectPath, signIn, router]);

  return (
    <main className="relative w-full h-screen flex justify-center items-center bg-[#1E1E1E]">
      <div className="flex flex-col items-center">
        <Text>Login Success!</Text>
      </div>
    </main>
  );
};

export default Page;
