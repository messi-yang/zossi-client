import { Wrapper } from './sub-components/wrapper';
import { Background } from './sub-components/background';
import { Modal } from './sub-components/modal';

type BaseModalProps = {
  width?: string | number;
  height?: string | number;
  opened: boolean;
  children: React.ReactNode;
  onBackgroundClick?: () => void;
  onCrossClick?: () => void;
};

export function BaseModal({ opened, width, height, children, onBackgroundClick, onCrossClick }: BaseModalProps) {
  return (
    <Wrapper visible={opened}>
      <Background onClick={onBackgroundClick} />
      <Modal width={width} height={height} onCrossClick={onCrossClick}>
        {children}
      </Modal>
    </Wrapper>
  );
}
