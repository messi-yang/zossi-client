import { useMemo } from 'react';
import { BaseModal } from '@/components/modals/base-modal';
import { dataTestids } from './data-test-ids';

type Props = {
  opened: boolean;
  embedCode: string;
  onClose?: () => void;
};

export function EmbedModal({ opened, embedCode, onClose }: Props) {
  const [iframeWidth, iframeHeight] = useMemo(() => {
    let width = '';
    let height = '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = embedCode;

    const iframeElement = tempDiv.getElementsByTagName('iframe')[0];

    const iframeWidthString = iframeElement.getAttribute('width');
    if (iframeWidthString === null) {
      width = '500px';
    } else if (/^\d+$/.test(iframeWidthString || '')) {
      width = `${iframeWidthString}px`;
    } else {
      width = iframeWidthString;
    }

    const iframeHeightString = iframeElement.getAttribute('height');
    if (iframeHeightString === null) {
      height = '500px';
    } else if (/^\d+$/.test(iframeHeightString || '')) {
      height = `${iframeHeightString}px`;
    } else {
      height = iframeHeightString;
    }

    return [width, height];
  }, [embedCode]);

  const embedCodeWithSize = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = embedCode;

    const iframeElement = tempDiv.getElementsByTagName('iframe')[0];
    iframeElement.setAttribute('width', iframeWidth);
    iframeElement.setAttribute('height', iframeHeight);

    return iframeElement.outerHTML;
  }, [iframeWidth, iframeHeight]);

  return (
    <BaseModal width={iframeWidth} height={iframeHeight} opened={opened} onBackgroundClick={onClose}>
      <section data-testid={dataTestids.root} dangerouslySetInnerHTML={{ __html: embedCodeWithSize }} />
    </BaseModal>
  );
}
