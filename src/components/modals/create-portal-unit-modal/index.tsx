import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text } from '@/components/texts/text';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { Input } from '@/components/inputs/input';
import { Field } from '@/components/fields/field';
import { PortalUnitApi } from '@/adapters/apis/portal-unit-api';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { PortalUnitCard } from '@/components/cards/portal-unit-card';

type Props = {
  worldId: string;
  opened: boolean;
  onConfirm?: (label: string, targetUnitId: string | null) => void;
  onCancel?: () => void;
};

export function CreatePortalUnitModal({ worldId, opened, onConfirm = () => {}, onCancel = () => {} }: Props) {
  const portalUnitApi = useMemo(() => PortalUnitApi.create(), []);
  const [isFetchingPortalUnits, setIsFetchingPortalUnits] = useState(false);
  const [portalUnits, setPortalUnits] = useState<PortalUnitModel[]>([]);
  useEffect(() => {
    if (!opened) return;

    setIsFetchingPortalUnits(true);
    portalUnitApi
      .query({ worldId, limit: 10, offset: 0, hasTargetUnit: false })
      .then((units) => {
        setPortalUnits(units);
      })
      .finally(() => {
        setIsFetchingPortalUnits(false);
      });
  }, [portalUnitApi, opened]);

  const [label, setLabel] = useState('');

  const handleCancelClick = useCallback(() => {
    setLabel('');
    onCancel();
  }, []);

  const [selectedPortalUnit, setSelectedPortalUnit] = useState<PortalUnitModel | null>(null);
  useEffect(() => {
    setSelectedPortalUnit(null);
  }, [opened, portalUnits]);

  const handleCreateClick = useCallback(() => {
    if (!label) return;
    onConfirm(label, selectedPortalUnit ? selectedPortalUnit.getId() : null);
    setLabel('');
  }, [label, selectedPortalUnit, onConfirm]);

  return (
    <BaseModal width={400} opened={opened}>
      <section className="relative w-full h-full flex flex-col items-center gap-4">
        <Text size="text-lg">Create Portal Unit</Text>
        <Field label="Label">
          <Input value={label} onInput={setLabel} placeholder="Enter label" />
        </Field>
        <Field label="Available Target Units">
          {isFetchingPortalUnits && <Text>Loading...</Text>}
          {portalUnits.map((unit) => (
            <PortalUnitCard
              key={unit.getId()}
              portalUnit={unit}
              selected={selectedPortalUnit?.getId() === unit.getId()}
              onClick={() => setSelectedPortalUnit(unit)}
            />
          ))}
        </Field>
        <section className="w-full flex flex-row justify-end items-center">
          <Button text="Create" onClick={handleCreateClick} />
          <div className="ml-4">
            <Button text="Cancel" onClick={handleCancelClick} />
          </div>
        </section>
      </section>
    </BaseModal>
  );
}
