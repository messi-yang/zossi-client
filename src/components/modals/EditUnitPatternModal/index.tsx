import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
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
      <section data-testid={dataTestids.root} style={{ position: 'relative', padding: '8px' }}>
        <section
          style={{
            position: 'relative',
            padding: '30px 24px 39px',
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            backgroundColor: '#121212',
            border: '4px solid white',
          }}
        >
          <div
            style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', justifyContent: 'flex-end' }}
          >
            <IconButton icon="cross" onClick={onCancel} />
          </div>
          <span style={{ color: 'white', textAlign: 'center' }}>PATTERN</span>
          <section style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
            <UnitPatternEditor
              unitSize={230 / (tmpUnitPattern?.[0]?.length || 1)}
              unitPattern={tmpUnitPattern}
              onUpdate={handleUnitPatternUpdate}
            />
          </section>
          <section style={{ marginTop: '24px', width: '100%', overflow: 'auto' }}>
            <section style={{ display: 'flex' }}>
              {unitPatternPresets.map((unitPatternPreset, unitPatternPresetIdx) => (
                <section
                  key={generateKeyFromIndex(unitPatternPresetIdx)}
                  style={{
                    marginLeft: unitPatternPresetIdx !== 0 ? '10px' : undefined,
                    flexShrink: '0',
                    border: isEqual(tmpUnitPattern, unitPatternPreset) ? '4px solid #01D6C9' : '4px solid black',
                  }}
                >
                  <UnitPatternEditor
                    unitSize={70 / (unitPatternPreset?.[0]?.length || 1)}
                    unitPattern={unitPatternPreset}
                    onUpdate={() => handleUnitPatternUpdate(unitPatternPreset)}
                  />
                </section>
              ))}
            </section>
          </section>
          <section style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
            <Button text="Ok" onClick={handleOkClick} />
          </section>
        </section>
      </section>
    </BaseModal>
  );
}

export default EditUnitPatternModal;
export { dataTestids };
