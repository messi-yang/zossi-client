import { dataTestids } from './dataTestids';

type Props = {
  highlighted: boolean;
};

export function CrossIcon({ highlighted }: Props) {
  return (
    <svg
      data-testid={dataTestids.root}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 27V22.6H9.4V18.2H13.8V13.8H9.4V9.4H5V5H9.4V9.4H13.8V13.8H18.2V9.4H22.6V5H27V9.4H22.6V13.8H18.2V18.2H22.6V22.6H27V27H22.6V22.6H18.2V18.2H13.8V22.6H9.4V27H5Z"
        fill={highlighted ? '#01D6C9' : 'white'}
      />
    </svg>
  );
}
