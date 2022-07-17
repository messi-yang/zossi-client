import dataTestidMap from '../dataTestidMap';

type WrapperProps = {
  children: JSX.Element;
};

export default function Wrapper({ children }: WrapperProps) {
  return (
    <section
      data-testid={dataTestidMap.wrapper}
      style={{ width: '100%', height: '100%', display: 'flex' }}
    >
      {children}
    </section>
  );
}
