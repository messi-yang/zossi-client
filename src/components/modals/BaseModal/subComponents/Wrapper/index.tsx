import { ReactFragment } from 'react';
import useWindowSize from '@/hooks/useWindowSize';

type WrapperProps = {
  visible: boolean;
  children: ReactFragment;
};

export default function Wrapper({ visible, children }: WrapperProps) {
  const windowSize = useWindowSize();
  return (
    <section
      className={[
        'fixed',
        'top-0',
        'left-0',
        'max-w-full',
        'max-h-full',
        visible ? 'flex' : 'hidden',
        'justify-center',
        'items-center',
        'overflow-hidden',
        'z-10',
      ].join(' ')}
      style={{
        width: windowSize.width,
        height: windowSize.height,
      }}
    >
      {children}
    </section>
  );
}
