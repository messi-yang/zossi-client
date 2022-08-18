import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import BaseModal from '@/components/modals/BaseModal';
import LiveUnitMapEditor from '@/components/editors/LiveUnitMapEditor';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import type { LiveUnitMapVO } from '@/valueObjects';
import { generateKeyFromIndex } from '@/utils/component';
import liveUnitMapTemplates from './liveUnitMapTemplates';
import dataTestids from './dataTestids';

type CornerSquareProps = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

function CornerSquare({ top, right, bottom, left }: CornerSquareProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        bottom,
        left,
        width: '56px',
        height: '56px',
        backgroundColor: 'white',
      }}
    />
  );
}

type Props = {
  opened: boolean;
  liveUnitMap: LiveUnitMapVO;
  onUpdate?: (liveUnitMap: LiveUnitMapVO) => any;
  onCancel?: () => void;
};

function LiveUnitMapModal({ opened, liveUnitMap, onUpdate = () => {}, onCancel = () => {} }: Props) {
  const [tmpUnitMap, setTmpUnitMap] = useState<LiveUnitMapVO>(cloneDeep(liveUnitMap));
  useEffect(() => {
    setTmpUnitMap(cloneDeep(liveUnitMap));
  }, [liveUnitMap]);
  useEffect(() => {
    setTmpUnitMap(cloneDeep(liveUnitMap));
  }, [opened]);
  const handleOkClick = () => {
    onUpdate(tmpUnitMap);
  };
  const handleLiveUnitMapUpdate = (newLiveUnitMap: LiveUnitMapVO) => {
    setTmpUnitMap(newLiveUnitMap);
  };

  return (
    <BaseModal width="560px" height="auto" opened={opened}>
      <section data-testid={dataTestids.root} style={{ position: 'relative', padding: '8px' }}>
        <CornerSquare top={-8} left={-8} />
        <CornerSquare top={-8} right={-8} />
        <CornerSquare bottom={-8} left={-8} />
        <CornerSquare bottom={-8} right={-8} />
        <section
          style={{
            position: 'relative',
            padding: '30px 24px 39px',
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            backgroundColor: '#121212',
          }}
        >
          <div
            style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', justifyContent: 'flex-end' }}
          >
            <IconButton icon="cross" onClick={onCancel} />
          </div>
          <span style={{ color: 'white', textAlign: 'center' }}>PATTERN</span>
          <section
            style={{ marginTop: '36px', width: '230px', height: '230px', display: 'flex', justifyContent: 'center' }}
          >
            <LiveUnitMapEditor liveUnitMap={tmpUnitMap} onUpdate={handleLiveUnitMapUpdate} />
          </section>
          <section style={{ marginTop: '24px', width: '100%', overflow: 'auto' }}>
            <section style={{ display: 'flex' }}>
              {liveUnitMapTemplates.map((liveUnitMapTemplate, liveUnitMapTemplateIdx) => (
                <section
                  key={generateKeyFromIndex(liveUnitMapTemplateIdx)}
                  style={{
                    marginLeft: liveUnitMapTemplateIdx !== 0 ? '10px' : undefined,
                    flexBasis: '74px',
                    height: '74px',
                    flexShrink: '0',
                    border: isEqual(tmpUnitMap, liveUnitMapTemplate) ? '4px solid #01D6C9' : '4px solid black',
                  }}
                >
                  <LiveUnitMapEditor
                    liveUnitMap={liveUnitMapTemplate}
                    onUpdate={() => handleLiveUnitMapUpdate(liveUnitMapTemplate)}
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

export default LiveUnitMapModal;
export { dataTestids };
