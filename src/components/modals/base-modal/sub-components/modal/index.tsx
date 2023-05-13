type ModalProps = {
  width: number;
  height?: number;
  children: JSX.Element;
};

export function Modal({ width, height, children }: ModalProps) {
  return (
    <section
      className="overflow-hidden bg-[#121212]"
      style={{
        width,
        height,
      }}
    >
      {children}
    </section>
  );
}
