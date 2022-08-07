import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import BaseModal from '@/components/modals/BaseModal';
import LiveUnitsBoardEditor from '@/components/editors/LiveUnitsBoardEditor';

type LiveUnitsBoard = boolean[][];

type Props = {
  opened: boolean;
  liveUnitsBoard: LiveUnitsBoard;
  onUpdate?: (liveUnitsBoard: LiveUnitsBoard) => any;
};

export default function LiveUnitsBoardModal({ opened, liveUnitsBoard, onUpdate = () => {} }: Props) {
  const [tmpUnitsBoard, setTmpUnitsBoard] = useState<LiveUnitsBoard>(cloneDeep(liveUnitsBoard));
  useEffect(() => {
    setTmpUnitsBoard(cloneDeep(liveUnitsBoard));
  }, [liveUnitsBoard]);
  const handleLiveUnitsBoardModalBackgroundClick = () => {
    onUpdate(tmpUnitsBoard);
  };
  const handleLiveUnitsBoardUpdate = (newLiveUnitsBoard: LiveUnitsBoard) => {
    setTmpUnitsBoard(newLiveUnitsBoard);
  };

  return (
    <BaseModal opened={opened} onBackgroundClick={handleLiveUnitsBoardModalBackgroundClick}>
      <LiveUnitsBoardEditor liveUnitsBoard={tmpUnitsBoard} onUpdate={handleLiveUnitsBoardUpdate} />
    </BaseModal>
  );
}
