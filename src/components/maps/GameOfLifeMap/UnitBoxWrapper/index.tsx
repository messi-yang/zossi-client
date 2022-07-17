import styles from '../styles';

type UnitBoxWrapperProps = {
  children: JSX.Element;
  hasBorder: boolean;
};

export default function UnitBoxWrapper({
  children,
  hasBorder,
}: UnitBoxWrapperProps) {
  return (
    <section
      style={{
        flexGrow: '1',
        display: 'flex',
        flexFlow: 'column',
        borderRight: hasBorder ? `1px solid ${styles.unitBoxBorderColor}` : '',
      }}
    >
      {children}
    </section>
  );
}
