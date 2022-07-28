import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import BaseModal from '@/components/modals/BaseModal';
import UnitsPatternEditor from '@/components/editors/UnitsPatternEditor';

type Coordinate = {
  x: number;
  y: number;
};

type UnitsPatternModalProp = {
  opened: boolean;
  relativeCoordinates: Coordinate[];
  onPatternUpdate?: (coordinates: Coordinate[]) => any;
};

export default function UnitsPatternModal({
  opened,
  relativeCoordinates,
  onPatternUpdate = () => {},
}: UnitsPatternModalProp) {
  const [tmpRelativeCoords, setTmpRelativeCoords] = useState<Coordinate[]>(
    cloneDeep(relativeCoordinates)
  );
  useEffect(() => {
    setTmpRelativeCoords(cloneDeep(relativeCoordinates));
  }, [relativeCoordinates]);
  const handleUnitsPatternModalBackgroundClick = () => {
    onPatternUpdate(tmpRelativeCoords);
  };
  const handlePatternUpdate = (newPattern: Coordinate[]) => {
    setTmpRelativeCoords(newPattern);
  };

  return (
    <BaseModal
      opened={opened}
      onBackgroundClick={handleUnitsPatternModalBackgroundClick}
    >
      <UnitsPatternEditor
        relativeCoordinates={tmpRelativeCoords}
        relativeCoordinateOffset={{ x: -2, y: -2 }}
        width={5}
        height={5}
        onUpdate={handlePatternUpdate}
      />
    </BaseModal>
  );
}
