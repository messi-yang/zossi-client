type Props = {
  hovered: boolean;
  children: JSX.Element;
};

export default function ContentWrapper({ hovered, children }: Props) {
  return (
    <div
      style={{
        height: '56px',
        display: 'flex',
        padding: '0',
        flexFlow: 'column',
        background: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 'calc(100% - 32px)',
            height: '8px',
            background: 'white',
          }}
        />
      </div>
      <div style={{ flexGrow: '1', display: 'flex', flexFlow: 'row' }}>
        <div
          style={{
            width: '8px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: 'calc(100% - 16px)',
              background: 'white',
            }}
          />
        </div>
        <div
          style={{
            width: '8px',
            height: '100%',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'white',
            }}
          />
          <div
            style={{
              flexGrow: '1',
              width: '100%',
              background: hovered ? 'white' : 'none',
            }}
          />
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'white',
            }}
          />
        </div>
        <div
          style={{
            flexGrow: '1',
          }}
        >
          {children}
        </div>
        <div
          style={{
            width: '8px',
            height: '100%',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'white',
            }}
          />
          <div
            style={{
              flexGrow: '1',
              width: '100%',
              background: hovered ? 'white' : 'none',
            }}
          />
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'white',
            }}
          />
        </div>
        <div
          style={{
            width: '8px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: 'calc(100% - 16px)',
              background: 'white',
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 'calc(100% - 32px)',
            height: '8px',
            background: 'white',
          }}
        />
      </div>
    </div>
  );
}
