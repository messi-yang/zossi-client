import { createContext, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { NotificationEventDispatcher } from '@/event-dispatchers/notification-event-dispatcher';

type ContextValue = {};

const Context = createContext<ContextValue>({});

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const notificationEventDispatcher = useMemo(() => NotificationEventDispatcher.create(), []);

  useEffect(() => {
    return notificationEventDispatcher.subscribeErrorTriggeredEvent((message) => {
      toast.error(message);
    });
  }, [notificationEventDispatcher]);

  return (
    <Context.Provider value={useMemo<ContextValue>(() => ({}), [])}>
      <Toaster />
      {children}
    </Context.Provider>
  );
}

export { Provider as NotificationProvider, Context as NotificationContext };
