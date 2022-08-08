import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import BaseModal from '@/components/modals/BaseModal';
import LiveUnitsBoardEditor from '@/components/editors/LiveUnitsBoardEditor';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';

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
  const handleOkClick = () => {
    onUpdate(tmpUnitsBoard);
  };
  const handleLiveUnitsBoardUpdate = (newLiveUnitsBoard: LiveUnitsBoard) => {
    setTmpUnitsBoard(newLiveUnitsBoard);
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
            <LiveUnitsBoardEditor liveUnitsBoard={tmpUnitsBoard} onUpdate={handleLiveUnitsBoardUpdate} />
          </section>
          <section style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
            <Button text="Ok" onClick={handleOkClick} />
          </section>
        </section>
      </section>
    </BaseModal>
  );
}
