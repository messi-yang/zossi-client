import { Text } from '@/components/texts/text';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { dataTestids } from './data-test-ids';

type Props = {
  opened: boolean;
  message: string;
  buttonCopy: string;
  onComfirm?: () => void;
};

export function MessageModal({ opened, message, buttonCopy, onComfirm = () => {} }: Props) {
  return (
    <BaseModal width={300} opened={opened}>
      <section
        data-testid={dataTestids.root}
        className="relative p-6 w-full h-full flex flex-col items-center border-4 border-solid border-white bg-[#121212]"
      >
        <Text size="text-lg">{message}</Text>
        <section className="mt-9 flex justify-center">
          <Button text={buttonCopy} onClick={onComfirm} />
        </section>
      </section>
    </BaseModal>
  );
}
