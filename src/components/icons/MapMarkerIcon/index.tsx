import dataTestids from './dataTestids';

type Props = {
  highlighted: boolean;
  active: boolean;
};

function MapMarkerIcon({ highlighted, active }: Props) {
  if (active) {
    return (
      <svg
        data-testid={dataTestids.root}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="8" y="28" width="17" height="1" fill="#01D6C9" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 3H21V4H22V5H23V6H24V7H25V14H24V16H23V18H22V20H21V22H20V24H19V25H18V26H17V27H16V26H15V25H14V24H13V22H12V20H11V18H10V16H9V14H8V7H9V6H10V5H11V4H12V3ZM15 7H18V8H19V9H20V10H21V13H20V14H19V15H18V16H15V15H14V14H13V13H12V10H13V9H14V8H15V7Z"
          fill="#01D6C9"
        />
      </svg>
    );
  }

  const fillForInactiveIcon = active || highlighted ? '#01D6C9' : 'white';
  return (
    <svg
      data-testid={dataTestids.root}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="24" y="7" width="1" height="7" fill={fillForInactiveIcon} />
      <rect x="23" y="14" width="1" height="3" fill={fillForInactiveIcon} />
      <rect x="22" y="17" width="1" height="2" fill={fillForInactiveIcon} />
      <rect x="21" y="19" width="1" height="2" fill={fillForInactiveIcon} />
      <rect x="20" y="21" width="1" height="2" fill={fillForInactiveIcon} />
      <rect x="19" y="23" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="8" y="28" width="17" height="1" fill={fillForInactiveIcon} />
      <rect x="17" y="25" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="16" y="26" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="15" y="25" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="14" y="24" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="13" y="23" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="12" y="21" width="1" height="2" fill={fillForInactiveIcon} />
      <rect x="11" y="19" width="1" height="2" fill={fillForInactiveIcon} />
      <rect x="10" y="17" width="1" height="2" fill={fillForInactiveIcon} />
      <rect x="9" y="14" width="1" height="3" fill={fillForInactiveIcon} />
      <rect x="8" y="7" width="1" height="7" fill={fillForInactiveIcon} />
      <rect x="18" y="24" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="22" y="5" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="23" y="6" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="20" y="10" width="1" height="3" fill={fillForInactiveIcon} />
      <rect x="19" y="13" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="19" y="9" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="18" y="14" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="14" y="14" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="18" y="8" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="14" y="8" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="13" y="13" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="13" y="9" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="12" y="10" width="1" height="3" fill={fillForInactiveIcon} />
      <rect x="15" y="15" width="3" height="1" fill={fillForInactiveIcon} />
      <rect x="15" y="7" width="3" height="1" fill={fillForInactiveIcon} />
      <rect x="21" y="4" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="10" y="5" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="11" y="4" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="9" y="6" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="12" y="3" width="9" height="1" fill={fillForInactiveIcon} />
    </svg>
  );
}

export default MapMarkerIcon;
export { dataTestids };
