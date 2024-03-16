import { BaseModal } from '@/components/modals/base-modal';
import { dataTestids } from './data-test-ids';

type Props = {
  opened: boolean;
  embedCode: string;
  onClose?: () => void;
};

export function EmbedModal({ opened, embedCode, onClose }: Props) {
  return (
    <BaseModal opened={opened} onBackgroundClick={onClose}>
      <section data-testid={dataTestids.root} dangerouslySetInnerHTML={{ __html: embedCode }} />
    </BaseModal>
  );
}
