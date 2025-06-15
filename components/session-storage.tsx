'use client';

import { useEffect } from 'react';

export function SessionStorage({ session }: { session: any }) {
  useEffect(() => {
    if (session) {
      localStorage.setItem('@app-dubaicash/userSession', JSON.stringify(session));
    }
  }, [session]);

  return null; // Este componente não renderiza nada
}