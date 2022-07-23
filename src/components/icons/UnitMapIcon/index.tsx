type Props = {
  highlighted: boolean;
  active: boolean;
};

function UnitMapIcon({ highlighted, active }: Props) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.19995 3.19995H28.7999V28.7999H3.19995V3.19995ZM20.8 4.26662H27.7333V11.7333H20.8V4.26662ZM19.7333 4.26662H12.2666V11.7333H19.7333V4.26662ZM11.2 4.26662H4.26662V11.7333H11.2V4.26662ZM4.26662 12.8V19.7333H11.2V12.8H4.26662ZM4.26662 20.8V27.7333H11.2V20.8H4.26662ZM12.2666 27.7333H19.7333V20.8H12.2666V27.7333ZM20.8 27.7333H27.7333V20.8H20.8V27.7333ZM27.7333 19.7333V12.8H20.8V19.7333H27.7333ZM19.7333 19.7333H12.2666V12.8H19.7333V19.7333Z"
        fill={active || highlighted ? '#01D6C9' : 'white'}
      />
      {active && (
        <path
          d="M12.2666 19.7333H19.7333V12.8H12.2666V19.7333Z"
          fill="#01D6C9"
        />
      )}
    </svg>
  );
}

export default UnitMapIcon;
