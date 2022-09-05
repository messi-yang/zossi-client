type ModalProps = {
  width: string;
  height: string;
  children: JSX.Element;
};

export default function Modal({ width, height, children }: ModalProps) {
  return (
    <section
      className="overflow-hidden"
      style={{
        width,
        height,
        backgroundColor: '#121212',
      }}
    >
      {children}
    </section>
  );
}
