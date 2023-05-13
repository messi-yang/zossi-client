type Props = {
  highlighted: boolean;
  children: JSX.Element;
};

export function ContentWrapper({ highlighted, children }: Props) {
  return (
    <div className="h-14 flex p-0 flex-col bg-none">
      <div className="w-full flex justify-center px-4">
        <div className="w-full h-2 bg-white" />
      </div>
      <div className="grow flex flex-row">
        <div className="w-2 h-full flex py-2 items-center">
          <div className="w-full h-full bg-white" />
        </div>
        <div className="w-2 h-full flex flex-col">
          <div className="w-full h-2 bg-white" />
          <div className={['grow', 'w-full', highlighted ? 'bg-white' : 'bg-none'].join(' ')} />
          <div className="w-full h-2 bg-white" />
        </div>
        <div className="grow">{children}</div>
        <div className="w-2 h-full flex flex-col">
          <div className="w-full h-2 bg-white" />
          <div className={['grow', 'w-full', highlighted ? 'bg-white' : 'bg-none'].join(' ')} />
          <div className="w-full h-2 bg-white" />
        </div>
        <div className="w-2 h-full flex py-2 items-center">
          <div className="w-full h-full bg-white" />
        </div>
      </div>
      <div className="w-full flex px-4 justify-center">
        <div className="w-full h-2 bg-white" />
      </div>
    </div>
  );
}
