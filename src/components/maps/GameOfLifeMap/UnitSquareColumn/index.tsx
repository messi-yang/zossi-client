type UnitSquareColumnProps = {
  children: JSX.Element;
};

export default function UnitSquareColumn({ children }: UnitSquareColumnProps) {
  return (
    <section
      style={{
        flexGrow: '1',
        display: 'flex',
        flexFlow: 'column',
      }}
    >
      {children}
    </section>
  );
}
