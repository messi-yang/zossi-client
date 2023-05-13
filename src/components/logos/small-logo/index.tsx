import { dataTestids } from './dataTestids';

export function SmallLogo() {
  return (
    <svg
      data-testid={dataTestids.root}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27 27.5H27.5V27V11.4V10.9H27H14H13.5V11.4V16.6V17.1H14H16.1V21.3H11.9V6.7H27H27.5V6.2V1V0.5H27H3.6H3.1V1V3.1H1H0.5V3.6V24.4V24.9H1H3.1V27V27.5H3.6H27Z"
        stroke="url(#paint0_linear_78_37)"
      />
      <defs>
        <linearGradient id="paint0_linear_78_37" x1="14" y1="1" x2="14" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF3434" />
          <stop offset="1" stopColor="#35C2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
