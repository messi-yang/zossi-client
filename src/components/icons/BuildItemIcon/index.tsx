import dataTestids from './dataTestids';

type Props = {
  highlighted: boolean;
  active: boolean;
};

function BuildItemIcon({ highlighted, active }: Props) {
  const fill = active || highlighted ? '#01D6C9' : 'white';
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3H27V4H21V12H28V5H29V27H28V21H21V28H27V29H5V28H11V21H4V27H3V5H4V12H11V4H5V3ZM12 28H20V21H12V28ZM28 13V20H21V13H28ZM20 13V20H12V13H20ZM11 13V20H4V13H11ZM12 12H20V4H12V12Z"
        fill={fill}
      />
      <path d="M5 4V5H4V4H5Z" fill={fill} />
      <path d="M4 27H5V28H4V27Z" fill={fill} />
      <path d="M27 28H28V27H27V28Z" fill={fill} />
      <path d="M28 5H27V4H28V5Z" fill={fill} />
      {active && <path d="M20 20V13H12V20H20Z" fill="#01D6C9" />}
    </svg>
  );
}

export default BuildItemIcon;
export { dataTestids };
