import { ReactFragment } from 'react';
import classnames from 'classnames';

type WrapperProps = {
  visible: boolean;
  children: ReactFragment;
};

export default function Wrapper({ visible, children }: WrapperProps) {
  return (
    <section
      className={classnames([
        'fixed',
        'top-0',
        'left-0',
        'w-screen',
        'h-screen',
        visible ? 'flex' : 'hidden',
        'justify-center',
        'items-center',
        'overflow-hidden',
        'z-10',
      ])}
    >
      {children}
    </section>
  );
}
