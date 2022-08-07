import Wrapper from './subComponents/Wrapper';
import Background from './subComponents/Background';
import Modal from './subComponents/Modal';

type BaseModalProps = {
  opened: boolean;
  children: JSX.Element;
  onBackgroundClick?: () => void;
};

export default function BaseModal({ opened, children, onBackgroundClick }: BaseModalProps) {
  return (
    <Wrapper visible={opened}>
      <Background onClick={onBackgroundClick} />
      <Modal>{children}</Modal>
    </Wrapper>
  );
}
