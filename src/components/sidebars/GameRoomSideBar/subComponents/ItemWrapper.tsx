import { useRef } from 'react';
import useHover from '@/hooks/useHover';

type Props = {
  hovered: boolean;
  children: JSX.Element;
  onHoverStateChange?: (hovered: boolean) => any;
  onClick?: () => any;
};

function ItemWrapper({ hovered, children, onHoverStateChange = () => {}, onClick = () => {} }: Props) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  useHover(nodeRef, onHoverStateChange);

  return (
    <section
      ref={nodeRef}
      style={{
        width: '100%',
        height: '100%',
        flexBasis: '70px',
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
