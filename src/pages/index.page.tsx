import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import useWindowSize from '@/hooks/useWindowSize';

import BigLogo from '@/components/logos/BigLogo';
import Button from '@/components/buttons/Button';

const Landing: NextPage = function Landing() {
  const windowSize = useWindowSize();
  const deviceSize: 'large' | 'small' = windowSize.width > 475 ? 'large' : 'small';

  const router = useRouter();

  const onStartClick = () => {
    router.push('/room/a');
  };

  return (
    <main
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: windowSize.width,
        height: windowSize.height,
        backgroundColor: '#1E1E1E',
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
