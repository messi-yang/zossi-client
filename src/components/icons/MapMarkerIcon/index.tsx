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
        <rect x="7.5" y="28" width="17" height="1" fill="#01D6C9" />
        <path d="M19.5 10H20.5V13H19.5V10Z" fill="#01D6C9" />
        <path d="M18.5 9H19.5V10H18.5V9Z" fill="#01D6C9" />
        <path d="M17.5 8H18.5V9H17.5V8Z" fill="#01D6C9" />
        <path d="M14.5 8V7H17.5V8H14.5Z" fill="#01D6C9" />
        <path d="M13.5 9V8H14.5V9H13.5Z" fill="#01D6C9" />
        <path d="M12.5 10V9H13.5V10H12.5Z" fill="#01D6C9" />
        <path d="M12.5 13H11.5V10H12.5V13Z" fill="#01D6C9" />
        <path d="M13.5 14H12.5V13H13.5V14Z" fill="#01D6C9" />
        <path d="M14.5 15H13.5V14H14.5V15Z" fill="#01D6C9" />
        <path d="M17.5 15V16H14.5V15H17.5Z" fill="#01D6C9" />
        <path d="M18.5 14V15H17.5V14H18.5Z" fill="#01D6C9" />
        <path d="M18.5 14H19.5V13H18.5V14Z" fill="#01D6C9" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5 2H12.5V3H10.5V4H9.5V5H8.5V6H7.5V8H6.5V13H7.5V15H8.5V17H9.5V19H10.5V21H11.5V23H12.5V24H13.5V25H14.5V26H15.5V27H16.5V26H17.5V25H18.5V24H19.5V23H20.5V21H21.5V19H22.5V17H23.5V15H24.5V13H25.5V8H24.5V6H23.5V5H22.5V4H21.5V3H19.5V2ZM19.5 3V4H21.5V5H22.5V6H23.5V8H24.5V13H23.5V15H22.5V17H21.5V19H20.5V21H19.5V23H18.5V24H17.5V25H16.5V26H15.5V25H14.5V24H13.5V23H12.5V21H11.5V19H10.5V17H9.5V15H8.5V13H7.5V8H8.5V6H9.5V5H10.5V4H12.5V3H19.5Z"
          fill="#01D6C9"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5 4V3H12.5V4H10.5V5H9.5V6H8.5V8H7.5V13H8.5V15H9.5V17H10.5V19H11.5V21H12.5V23H13.5V24H14.5V25H15.5V26H16.5V25H17.5V24H18.5V23H19.5V21H20.5V19H21.5V17H22.5V15H23.5V13H24.5V8H23.5V6H22.5V5H21.5V4H19.5ZM19.5 10H20.5V13H19.5V14H18.5V15H17.5V16H14.5V15H13.5V14H12.5V13H11.5V10H12.5V9H13.5V8H14.5V7H17.5V8H18.5V9H19.5V10Z"
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
      <rect x="25" y="8" width="1" height="5" fill={fillForInactiveIcon} />
      <rect x="23" y="15" width="1" height="2" fill={fillForInactiveIcon} />
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
      <rect x="9" y="15" width="1" height="2" fill={fillForInactiveIcon} />
      <rect x="7" y="8" width="1" height="5" fill={fillForInactiveIcon} />
      <rect x="18" y="24" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="23" y="5" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="24" y="6" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="24" y="7" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="24" y="13" width="1" height="2" fill={fillForInactiveIcon} />
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
      <rect x="22" y="4" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="9" y="5" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="10" y="4" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="11" y="3" width="2" height="1" fill={fillForInactiveIcon} />
      <rect x="20" y="3" width="2" height="1" fill={fillForInactiveIcon} />
      <rect x="9" y="5" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="8" y="6" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="8" y="7" width="1" height="1" fill={fillForInactiveIcon} />
      <rect x="8" y="13" width="1" height="2" fill={fillForInactiveIcon} />
      <rect x="13" y="2" width="7" height="1" fill={fillForInactiveIcon} />
    </svg>
  );
}

export default MapMarkerIcon;
export { dataTestids };
