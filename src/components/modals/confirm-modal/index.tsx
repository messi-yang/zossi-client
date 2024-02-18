import { Text } from '@/components/texts/text';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { dataTestids } from './data-test-ids';

type Props = {
  opened: boolean;
  message: string;
  onComfirm?: () => void;
  onCancel?: () => void;
};

export function ConfirmModal({ opened, message, onComfirm = () => {}, onCancel = () => {} }: Props) {
  return (
    <BaseModal width={300} opened={opened}>
      <section
        data-testid={dataTestids.root}
        className="relative p-6 w-full h-full flex flex-col items-center border-4 border-solid border-white bg-[#121212]"
      >
        <Text size="text-lg">{message}</Text>
        <section className="mt-9 flex flex-row justify-center items-center">
          <Button text="Confirm" onClick={onComfirm} />
          <div className="ml-4">
            <Button text="Cancel" onClick={onCancel} />
          </div>
        </section>
      </section>
    </BaseModal>
  );
}
