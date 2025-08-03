import classnames from 'classnames';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { Text } from '@/components/texts/text';

type Props = {
  portalUnit: PortalUnitModel;
  selected?: boolean;
  onClick?: () => void;
};

export function PortalUnitCard({ portalUnit, selected, onClick }: Props) {
  return (
    <div
      className={classnames(
        'flex flex-row gap-4 p-4 border  rounded-md hover:bg-gray-100 cursor-pointer text-white hover:text-black',
        'hover:bg-gray-100',
        'text-white hover:text-black',
        selected ? 'border-blue-600' : 'border-gray-300'
      )}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClick?.();
        }
      }}
    >
      <Text color="text-current">{portalUnit.getLabel()}</Text>
      <Text color="text-current">{portalUnit.getPosition().toText()}</Text>
    </div>
  );
}
