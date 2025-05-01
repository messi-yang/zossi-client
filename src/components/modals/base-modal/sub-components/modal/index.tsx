import { IconButton } from '@/components/buttons/icon-button';

type ModalProps = {
  width?: string | number;
  height?: string | number;
  onCrossClick?: () => void;
  children: React.ReactNode;
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
        <div className="absolute top-4 right-4 z-10">
          <IconButton iconName="material-symbols:close-rounded" onClick={onCrossClick} />
        </div>
      )}
      {children}
    </section>
  );
}
