import { useMemo } from 'react';
import { Text } from '@/components/texts/text';
import { BaseModal } from '@/components/modals/base-modal';
import { dataTestids } from './data-test-ids';
import { WorldMemberModel } from '@/models/iam/world-member-model';
import { WorldModel } from '@/models/world/world/world-model';
import { WorldMemberCard } from '@/components/cards/world-member-card';
import { Input } from '@/components/inputs/input';
import { Button } from '@/components/buttons/button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

type Props = {
  opened: boolean;
  world: WorldModel;
  worldMembes: WorldMemberModel[] | null;
  onClose?: () => void;
};

export function ShareWorldModal({ opened, world, worldMembes, onClose }: Props) {
  const shareLink = useMemo(() => `${globalThis.location?.origin}/worlds/${world.getId()}`, [world]);
  const [copyToClipboard, isJustCopied] = useCopyToClipboard(shareLink);

  return (
    <BaseModal width={400} opened={opened} onBackgroundClick={onClose} onCrossClick={onClose}>
      <section data-testid={dataTestids.root} className="">
        <div>
          <Text>Share World</Text>
        </div>
        <div className="mt-5 w-full flex flex-row justify-between items-center">
          <div className="grow">
            <Input value={shareLink} disabled />
          </div>
          <div className="ml-2">
            <Button text={isJustCopied ? 'Copied' : 'Copy'} onClick={copyToClipboard} />
          </div>
        </div>
        {worldMembes && (
          <div className="mt-5 w-full flex flex-col">
            {worldMembes.map((worldMember) => (
              <div key={worldMember.getId()}>
                <WorldMemberCard worldMember={worldMember} />
              </div>
            ))}
          </div>
        )}
      </section>
    </BaseModal>
  );
}
