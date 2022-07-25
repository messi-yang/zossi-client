import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import BaseModal from '@/components/modals/BaseModal';
import UnitsPatternEditor from '@/components/editors/UnitsPatternEditor';

type Pattern = boolean[][];

type UnitsPatternModalProp = {
  opened: boolean;
  pattern: Pattern;
  onPatternUpdate?: (pattern: Pattern) => any;
};

export default function UnitsPatternModal({
  opened,
  pattern,
  onPatternUpdate = () => {},
}: UnitsPatternModalProp) {
  const [tmpPattern, setTmpPattern] = useState<Pattern>(cloneDeep(pattern));
  useEffect(() => {
    setTmpPattern(cloneDeep(pattern));
  }, [pattern]);
  const handleUnitsPatternModalBackgroundClick = () => {
    onPatternUpdate(tmpPattern);
  };
  const handlePatternUpdate = (newPattern: Pattern) => {
    setTmpPattern(newPattern);
  };

  return (
    <BaseModal
      opened={opened}
      onBackgroundClick={handleUnitsPatternModalBackgroundClick}
    >
      <UnitsPatternEditor pattern={tmpPattern} onUpdate={handlePatternUpdate} />
    </BaseModal>
  );
}
