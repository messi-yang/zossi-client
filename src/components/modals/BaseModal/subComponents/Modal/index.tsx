type ModalProps = {
  width: string;
  height: string;
  children: JSX.Element;
};

export default function Modal({ width, height, children }: ModalProps) {
  return (
    <section
      style={{
        width,
        height,
        backgroundColor: '#121212',
        overflow: 'hidden',
      }}
    >
      {children}
    </section>
  );
}
