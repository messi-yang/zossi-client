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
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: windowSize.width,
        height: windowSize.height,
        maxWidth: '100%',
        maxHeight: '100%',
        display: visible ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        overflow: 'hidden',
      }}
    >
      {children}
    </section>
  );
}
