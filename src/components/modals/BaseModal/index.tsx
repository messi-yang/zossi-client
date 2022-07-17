import Wrapper from './Wrapper';
import Background from './Background';
import Modal from './Modal';

type BaseModalProps = {
  opened: boolean;
  children: JSX.Element;
  onBackgroundClick: () => any;
};

export default function BaseModal({
  opened,
  children,
  onBackgroundClick,
}: BaseModalProps) {
  return (
    <Wrapper visible={opened}>
      <Background onClick={onBackgroundClick} />
      <Modal>{children}</Modal>
    </Wrapper>
  );
}
