import Link from 'next/link';

type Props = {
  children: JSX.Element;
};

export function DashboardLayout({ children }: Props) {
  return (
    <div className="h-screen flex flex-row">
      <div className="bg-white basis-20 h-full">
        <Link href="/">Home</Link>
      </div>
      <div className="grow h-full">{children}</div>
    </div>
  );
}
