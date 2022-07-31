type BackgroundProps = {
  onClick: () => any;
};

export default function Background({ onClick }: BackgroundProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '0',
        backgroundColor: 'rgba(0,0,0,0.8)',
        cursor: 'pointer',
      }}
      role="button"
      aria-label="modal background"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
    />
  );
}
