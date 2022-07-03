type Props = {
  hovered: boolean;
  active: boolean;
};

function UnitMapIcon({ hovered, active }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.75 8.75H1V15.625H7.75V8.75ZM7.75 7.75H1V1.6C1 1.26863 1.26863 1 1.6 1H7.75V7.75ZM8.75 8.75V15.625H15.625V8.75H8.75ZM15.625 7.75H8.75V1H15.625V7.75ZM16.625 8.75V15.625H23V8.75H16.625ZM23 7.75H16.625V1H22.4C22.7314 1 23 1.26863 23 1.6V7.75ZM24 22.4C24 23.2837 23.2837 24 22.4 24H1.6C0.716344 24 0 23.2837 0 22.4V1.6C0 0.716344 0.716344 0 1.6 0H22.4C23.2837 0 24 0.716344 24 1.6V22.4ZM1 16.625V22.4C1 22.7314 1.26863 23 1.6 23H7.75V16.625H1ZM8.75 16.625V23H15.625V16.625H8.75ZM16.625 16.625V23H22.4C22.7314 23 23 22.7314 23 22.4V16.625H16.625Z"
        fill={hovered ? '#01D6C9' : '#EFEFEF'}
      />
      {active && (
        <path d="M8.75 15.625V8.75H15.625V15.625H8.75Z" fill="#01D6C9" />
      )}
    </svg>
  );
}

export default UnitMapIcon;
