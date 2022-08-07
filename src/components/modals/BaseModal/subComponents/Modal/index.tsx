type ModalProps = {
  children: JSX.Element;
};

export default function Modal({ children }: ModalProps) {
  return (
    <section
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '100%',
        maxHeight: '100%',
        backgroundColor: '#121212',
      }}
    >
      {children}
    </section>
  );
}
