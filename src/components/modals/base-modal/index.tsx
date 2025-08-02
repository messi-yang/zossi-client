'use client';

import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Wrapper } from './sub-components/wrapper';
import { Background } from './sub-components/background';
import { Modal } from './sub-components/modal';

type BaseModalProps = {
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  opened: boolean;
  children: React.ReactNode;
  onBackgroundClick?: () => void;
  onCrossClick?: () => void;
};

export function BaseModal({ opened, width, height, padding = 16, children, onBackgroundClick, onCrossClick }: BaseModalProps) {
  const portalRoot = useMemo(() => {
    if (!('document' in globalThis)) {
      return null;
    }
    return globalThis.document.body;
  }, []);

  return portalRoot
    ? createPortal(
        <Wrapper visible={opened}>
          <Background onClick={onBackgroundClick} />
          <Modal width={width} height={height} padding={padding} onCrossClick={onCrossClick}>
            {children}
          </Modal>
        </Wrapper>,
        portalRoot
      )
    : null;
}
