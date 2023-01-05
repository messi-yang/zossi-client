import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useOnHistoryChange(handler: () => void) {
  const router = useRouter();

  const handleBeforeHistoryChange = (route: string) => {
    const isRefreshingPage = route === global.history.state.as;
    if (isRefreshingPage) {
      return;
    }
    handler();
  };

  useEffect(() => {
    router.events.on('beforeHistoryChange', handleBeforeHistoryChange);
    return () => {
      router.events.off('beforeHistoryChange', handleBeforeHistoryChange);
    };
  }, [handler]);
}
