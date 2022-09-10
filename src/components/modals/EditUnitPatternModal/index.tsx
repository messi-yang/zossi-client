import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import Text from '@/components/text/Text';
import BaseModal from '@/components/modals/BaseModal';
import UnitPatternEditor from '@/components/editors/UnitPatternEditor';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import type { UnitPatternVO } from '@/valueObjects';
import { generateKeyFromIndex } from '@/utils/component';
import unitPatternPresets from './unitPatternPresets';
import dataTestids from './dataTestids';

type Props = {
  opened: boolean;
  unitPattern: UnitPatternVO;
  onUpdate?: (unitPattern: UnitPatternVO) => any;
  onCancel?: () => void;
};

function EditUnitPatternModal({ opened, unitPattern, onUpdate = () => {}, onCancel = () => {} }: Props) {
  const [tmpUnitPattern, setTmpUnitPattern] = useState<UnitPatternVO>(cloneDeep(unitPattern));
  useEffect(() => {
    setTmpUnitPattern(cloneDeep(unitPattern));
  }, [unitPattern]);
  useEffect(() => {
    setTmpUnitPattern(cloneDeep(unitPattern));
  }, [opened]);
  const handleOkClick = () => {
    onUpdate(tmpUnitPattern);
  };
  const handleUnitPatternUpdate = (newUnitPattern: UnitPatternVO) => {
    setTmpUnitPattern(newUnitPattern);
  };

  return (
    <BaseModal width="560px" height="auto" opened={opened}>
      <section data-testid={dataTestids.root} className="relative p-2">
        <section
          className="relative pt-8 px-6 pb-10 flex flex-col items-center border-4 border-solid border-white"
          style={{
            backgroundColor: '#121212',
          }}
        >
          <div className="absolute top-5 right-5 flex justify-end">
            <IconButton icon="cross" onClick={onCancel} />
          </div>
          <span className="text-white text-center">PATTERN</span>
          <section className="mt-9 flex justify-center">
            <UnitPatternEditor
              unitSize={230 / (tmpUnitPattern?.[0]?.length || 1)}
              unitPattern={tmpUnitPattern}
              onUpdate={handleUnitPatternUpdate}
            />
          </section>
          <section className="mt-6 w-full overflow-auto">
            <section className="flex">
              {unitPatternPresets.map((unitPatternPreset, unitPatternPresetIdx) => (
                <section
                  key={generateKeyFromIndex(unitPatternPresetIdx)}
                  className={[
                    unitPatternPresetIdx !== 0 && 'ml-3',
                    'shrink-0',
                    'inline-flex',
                    'items-center',
                    'flex-col',
                  ].join(' ')}
                >
                  <div
                    className={['border-4', 'border-solid'].join(' ')}
                    style={{
                      borderColor: isEqual(tmpUnitPattern, unitPatternPreset.pattern) ? '#01D6C9' : 'rgba(0,0,0,0)',
                    }}
                  >
                    <UnitPatternEditor
                      unitSize={70 / (unitPatternPreset?.pattern[0]?.length || 1)}
                      unitPattern={unitPatternPreset.pattern}
                      onUpdate={() => handleUnitPatternUpdate(unitPatternPreset.pattern)}
                    />
                  </div>
                  <Text color="white" copy={unitPatternPreset.title} />
                </section>
              ))}
            </section>
          </section>
          <section className="mt-9 flex justify-center">
            <Button text="Ok" onClick={handleOkClick} />
          </section>
        </section>
      </section>
    </BaseModal>
  );
}

export default EditUnitPatternModal;
export { dataTestids };
