import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import BaseModal from '@/components/modals/BaseModal';
import RelativeCoordinatesEditor from '@/components/editors/RelativeCoordinatesEditor';

type Coordinate = {
  x: number;
  y: number;
};

type Props = {
  opened: boolean;
  relativeCoordinates: Coordinate[];
  onPatternUpdate?: (coordinates: Coordinate[]) => any;
};

export default function EditRelativeCoordinatesModal({
  opened,
  relativeCoordinates,
  onPatternUpdate = () => {},
}: Props) {
  const [tmpRelativeCoords, setTmpRelativeCoords] = useState<Coordinate[]>(
    cloneDeep(relativeCoordinates)
  );
  useEffect(() => {
    setTmpRelativeCoords(cloneDeep(relativeCoordinates));
  }, [relativeCoordinates]);
  const handleEditRelativeCoordinatesModalBackgroundClick = () => {
    onPatternUpdate(tmpRelativeCoords);
  };
  const handlePatternUpdate = (newPattern: Coordinate[]) => {
    setTmpRelativeCoords(newPattern);
  };

  return (
    <BaseModal
      opened={opened}
      onBackgroundClick={handleEditRelativeCoordinatesModalBackgroundClick}
    >
      <RelativeCoordinatesEditor
        relativeCoordinates={tmpRelativeCoords}
        relativeCoordinateOffset={{ x: -2, y: -2 }}
        width={5}
        height={5}
        onUpdate={handlePatternUpdate}
      />
    </BaseModal>
  );
}
