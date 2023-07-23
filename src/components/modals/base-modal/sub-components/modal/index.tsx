import { IconButton } from '@/components/buttons/icon-button';

type ModalProps = {
  width: number;
  height?: number;
  onCrossClick?: () => void;
  children: JSX.Element;
};

export function Modal({ width, height, onCrossClick = () => {}, children }: ModalProps) {
  return (
    <section
      className="relative overflow-hidden bg-[#121212]"
      style={{
        width,
        height,
      }}
    >
      <div className="absolute top-2 right-2 z-10">
        <IconButton icon="cross" onClick={onCrossClick} />
      </div>
      {children}
    </section>
  );
}
