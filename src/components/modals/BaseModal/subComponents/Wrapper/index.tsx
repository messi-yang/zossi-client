import { ReactFragment } from 'react';

type WrapperProps = {
  visible: boolean;
  children: ReactFragment;
};

export default function Wrapper({ visible, children }: WrapperProps) {
  return (
    <section
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
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
