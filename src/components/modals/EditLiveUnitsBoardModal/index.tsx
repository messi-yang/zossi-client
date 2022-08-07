import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import BaseModal from '@/components/modals/BaseModal';
import LiveUnitsBoardEditor from '@/components/editors/LiveUnitsBoardEditor';
import Button from '@/components/buttons/Button';
import CrossIcon from '@/components/icons/CrossIcon';

type LiveUnitsBoard = boolean[][];

type Props = {
  opened: boolean;
  liveUnitsBoard: LiveUnitsBoard;
  onUpdate?: (liveUnitsBoard: LiveUnitsBoard) => any;
  onCancel?: () => void;
};

export default function LiveUnitsBoardModal({
  opened,
  liveUnitsBoard,
  onUpdate = () => {},
  onCancel = () => {},
}: Props) {
  const [tmpUnitsBoard, setTmpUnitsBoard] = useState<LiveUnitsBoard>(cloneDeep(liveUnitsBoard));
  useEffect(() => {
    setTmpUnitsBoard(cloneDeep(liveUnitsBoard));
  }, [liveUnitsBoard]);
  useEffect(() => {
    setTmpUnitsBoard(cloneDeep(liveUnitsBoard));
  }, [opened]);
  const handleLiveUnitsBoardModalBackgroundClick = () => {
    onCancel();
  };
  const handleOkClick = () => {
    onUpdate(tmpUnitsBoard);
  };
  const handleLiveUnitsBoardUpdate = (newLiveUnitsBoard: LiveUnitsBoard) => {
    setTmpUnitsBoard(newLiveUnitsBoard);
  };

  return (
    <BaseModal opened={opened} onBackgroundClick={handleLiveUnitsBoardModalBackgroundClick}>
      <section
        style={{
          position: 'relative',
          padding: '30px 24px 39px',
          display: 'flex',
          flexFlow: 'column',
        }}
      >
        <div
          style={{ position: 'absolute', top: '21px', right: '21px', display: 'inline-flex', cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          area-label="close modal"
          onClick={onCancel}
          onKeyDown={onCancel}
        >
          <CrossIcon />
        </div>
        <span style={{ color: 'white', textAlign: 'center' }}>PATTERN</span>
        <section style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
          <LiveUnitsBoardEditor liveUnitsBoard={tmpUnitsBoard} onUpdate={handleLiveUnitsBoardUpdate} />
        </section>
        <section style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
          <Button text="Ok" onClick={handleOkClick} />
        </section>
      </section>
    </BaseModal>
  );
}
