// src/hooks/useRouteRefresh.ts
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Refresh = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      window.location.reload();
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
};

export {Refresh}
