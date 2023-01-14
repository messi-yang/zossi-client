import Wrapper from './subComponents/Wrapper';
import Background from './subComponents/Background';
import Modal from './subComponents/Modal';

type BaseModalProps = {
  width: number;
  height?: number;
  opened: boolean;
  children: JSX.Element;
  onBackgroundClick?: () => void;
};

export default function BaseModal({ opened, width, height, children, onBackgroundClick }: BaseModalProps) {
  return (
    <Wrapper visible={opened}>
      <Background onClick={onBackgroundClick} />
      <Modal width={width} height={height}>
        {children}
      </Modal>
    </Wrapper>
  );
}
