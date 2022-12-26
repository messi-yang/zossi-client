import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import useWindowSize from '@/ui/hooks/useWindowSize';

import BigLogo from '@/ui/components/logos/BigLogo';
import Button from '@/ui/components/buttons/Button';

const Landing: NextPage = function Landing() {
  const windowSize = useWindowSize();
  const deviceSize: 'large' | 'small' = windowSize.width > 475 ? 'large' : 'small';

  const router = useRouter();

  const onStartClick = () => {
    router.push('/room/a');
  };

  return (
    <main
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]"
      style={{
        width: windowSize.width,
        height: windowSize.height,
      }}
    >
      <BigLogo width={deviceSize === 'large' ? undefined : windowSize.width * 0.8} />
      <div className="mt-[100px]">
        <Button text="Start" onClick={onStartClick} />
      </div>
    </main>
  );
};

export default Landing;
