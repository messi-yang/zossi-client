import { PropsWithChildren } from 'react';
import classnames from 'classnames';
import { dataTestids } from './data-test-ids';
import { Text } from '@/components/texts/text';

type Props = {
  label: string;
  description?: string;
};

export function Field({ children, label, description }: PropsWithChildren<Props>): JSX.Element {
  return (
    <div data-testid={dataTestids.root} className={classnames('flex', 'flex-col', 'w-full')}>
      <Text weight="font-bold">{label}</Text>
      {description && <Text size="text-base">{description}</Text>}
      <div className="mt-2 w-full">{children}</div>
    </div>
  );
}
