// src/hooks/useRouteRefresh.ts
"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const useRouteRefresh = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Use Next.js router refresh instead of window.location.reload
    // This is more efficient and maintains app state
    router.refresh();
  }, [pathname, router]);
};

export { useRouteRefresh }