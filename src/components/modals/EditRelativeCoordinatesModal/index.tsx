import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { CoordinateEntity } from '@/entities';
import BaseModal from '@/components/modals/BaseModal';
import RelativeCoordinatesEditor from '@/components/editors/RelativeCoordinatesEditor';

type Props = {
  opened: boolean;
  relativeCoordinates: CoordinateEntity[];
  onPatternUpdate?: (coordinates: CoordinateEntity[]) => any;
};

export default function EditRelativeCoordinatesModal({
  opened,
  relativeCoordinates,
  onPatternUpdate = () => {},
}: Props) {
  const [tmpRelativeCoords, setTmpRelativeCoords] = useState<
    CoordinateEntity[]
  >(cloneDeep(relativeCoordinates));
  useEffect(() => {
    setTmpRelativeCoords(cloneDeep(relativeCoordinates));
  }, [relativeCoordinates]);
  const handleEditRelativeCoordinatesModalBackgroundClick = () => {
    onPatternUpdate(tmpRelativeCoords);
  };
  const handlePatternUpdate = (newPattern: CoordinateEntity[]) => {
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
