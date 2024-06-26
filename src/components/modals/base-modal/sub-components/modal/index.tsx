import { IconButton } from '@/components/buttons/icon-button';

type ModalProps = {
  width?: string | number;
  height?: string | number;
  onCrossClick?: () => void;
  children: JSX.Element;
};

export function Modal({ width, height, onCrossClick, children }: ModalProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        width,
        height,
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 40px)',
      }}
    >
      {onCrossClick && (
        <div className="absolute top-2 right-2 z-10">
          <IconButton icon="cross" onClick={onCrossClick} />
        </div>
      )}
      {children}
    </section>
  );
}
