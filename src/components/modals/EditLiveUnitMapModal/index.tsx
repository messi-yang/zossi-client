import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import BaseModal from '@/components/modals/BaseModal';
import LiveUnitMapEditor from '@/components/editors/LiveUnitMapEditor';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import type { LiveUnitMapEntity } from '@/entities/';

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
        zIndex: -1,
      }}
    />
  );
}

type Props = {
  opened: boolean;
  liveUnitMap: LiveUnitMapEntity;
  onUpdate?: (liveUnitMap: LiveUnitMapEntity) => any;
  onCancel?: () => void;
};

export default function LiveUnitMapModal({ opened, liveUnitMap, onUpdate = () => {}, onCancel = () => {} }: Props) {
  const [tmpUnitMap, setTmpUnitMap] = useState<LiveUnitMapEntity>(cloneDeep(liveUnitMap));
  useEffect(() => {
    setTmpUnitMap(cloneDeep(liveUnitMap));
  }, [liveUnitMap]);
  useEffect(() => {
    setTmpUnitMap(cloneDeep(liveUnitMap));
  }, [opened]);
  const handleOkClick = () => {
    onUpdate(tmpUnitMap);
  };
  const handleLiveUnitMapUpdate = (newLiveUnitMap: LiveUnitMapEntity) => {
    setTmpUnitMap(newLiveUnitMap);
  };

  return (
    <BaseModal opened={opened}>
      <section style={{ position: 'relative' }}>
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
            backgroundColor: '#121212',
          }}
        >
          <div
            style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', justifyContent: 'flex-end' }}
          >
            <IconButton icon="cross" onClick={onCancel} />
          </div>
          <span style={{ color: 'white', textAlign: 'center' }}>PATTERN</span>
          <section style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
            <LiveUnitMapEditor liveUnitMap={tmpUnitMap} onUpdate={handleLiveUnitMapUpdate} />
          </section>
          <section style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
            <Button text="Ok" onClick={handleOkClick} />
          </section>
        </section>
      </section>
    </BaseModal>
  );
}
