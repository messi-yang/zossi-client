import { useRef } from 'react';
import useHover from '@/hooks/useHover';

type Props = {
  width: string;
  height: string;
  hovered: boolean;
  children: JSX.Element;
  onHoverStateChange?: (hovered: boolean) => any;
  onClick?: () => any;
};

function ItemWrapper({ width, height, hovered, children, onHoverStateChange = () => {}, onClick = () => {} }: Props) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  useHover(nodeRef, onHoverStateChange);

  return (
    <section
      ref={nodeRef}
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: hovered ? '#575757' : 'unset',
      }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
    >
      {children}
    </section>
  );
}

export default ItemWrapper;
