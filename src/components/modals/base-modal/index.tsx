import { Wrapper } from './sub-components/wrapper';
import { Background } from './sub-components/background';
import { Modal } from './sub-components/modal';

type BaseModalProps = {
  width: number;
  height?: number;
  opened: boolean;
  children: JSX.Element;
  onBackgroundClick?: () => void;
};

export function BaseModal({ opened, width, height, children, onBackgroundClick }: BaseModalProps) {
  return (
    <Wrapper visible={opened}>
      <Background onClick={onBackgroundClick} />
      <Modal width={width} height={height}>
        {children}
      </Modal>
    </Wrapper>
  );
}
