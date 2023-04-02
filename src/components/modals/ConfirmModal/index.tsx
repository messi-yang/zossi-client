import Text from '@/components/text/Text';
import BaseModal from '@/components/modals/BaseModal';
import Button from '@/components/buttons/Button';
import dataTestids from './dataTestids';

type Props = {
  opened: boolean;
  message: string;
  buttonCopy: string;
  onComfirm?: () => void;
};

function ConfirmModal({ opened, message, buttonCopy, onComfirm = () => {} }: Props) {
  return (
    <BaseModal width={300} opened={opened}>
      <section
        data-testid={dataTestids.root}
        className="relative p-6 w-full h-full flex flex-col items-center border-4 border-solid border-white bg-[#121212]"
      >
        <Text color="white" copy={message} size={18} />
        <section className="mt-9 flex justify-center">
          <Button text={buttonCopy} onClick={onComfirm} />
        </section>
      </section>
    </BaseModal>
  );
}

export default ConfirmModal;
export { dataTestids };
