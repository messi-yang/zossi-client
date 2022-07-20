import dataTestids from '../dataTestids';

type WrapperProps = {
  children: JSX.Element;
};

export default function Wrapper({ children }: WrapperProps) {
  return (
    <section
      data-testid={dataTestids.wrapper}
      style={{ width: '100%', height: '100%', display: 'flex' }}
    >
      {children}
    </section>
  );
}
