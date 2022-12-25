import { useState, useCallback, useEffect } from 'react';
import { ungzipBlob, gzipBlob } from '@/apis/compression';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'CONNECTED';
type ReturnValues = {
  status: Status;
  connect: () => void;
  sendMessage: (msg: Object) => void;
  disconnect: () => void;
};

type Actions = {
  onOpen(): void;
  onClose(): void;
  onMessage<T>(msg: T): void;
};

function useWebSocket(url: string, { onOpen, onClose, onMessage }: Actions): ReturnValues {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<Status>('CLOSED');

  const connect = useCallback(() => {
    if (status !== 'CLOSED') {
      return;
    }

    const newSocket = new WebSocket(url);
    setStatus('CONNECTING');
    setSocket(newSocket);
  }, [status, url]);

  const sendMessage = useCallback(
    async (msg: Object) => {
      if (!socket) {
        return;
      }
      if (status !== 'CONNECTED') {
        return;
      }

      const jsonString = JSON.stringify(msg);
      const jsonBlob = new Blob([jsonString]);
      const compressedJsonBlob = await gzipBlob(jsonBlob);
      socket.send(compressedJsonBlob);
    },
    [socket, status]
  );

  const disconnect = useCallback(() => {
    if (!socket || status !== 'CONNECTED') {
      return;
    }

    setStatus('CLOSING');
    socket.close();
  }, [socket, status]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onopen = () => {
      onOpen();
      setStatus('CONNECTED');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onclose = () => {
      onClose();
      setStatus('CLOSED');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = async ({ data }: any) => {
      const decompressedBlob = await ungzipBlob(data as Blob);
      const eventJsonString = await decompressedBlob.text();
      onMessage(JSON.parse(eventJsonString));
    };
  }, [socket, onMessage]);

  return {
    status,
    connect,
    sendMessage,
    disconnect,
  };
}

export default useWebSocket;
