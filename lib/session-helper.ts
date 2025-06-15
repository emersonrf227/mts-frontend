'use client';

import { Session } from 'next-auth';

export const getStoredSessionClient = (): Session | null => {
  if (typeof window !== 'undefined') {
    const sessionStr = localStorage.getItem('@app-dubaicash/userSession');
    return sessionStr ? JSON.parse(sessionStr) : null;
  }
  return null;
};
