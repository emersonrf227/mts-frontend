'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps
} from 'next-themes';
import { number, string } from 'zod';

type ThemeConfig = {
  id: number;
  uuid: string;
  url: string;
  aplicationName: string;
  title: string;
  primaryColor: string;
  secondaryColor: string;
  fontColor: string;
  img: string;
  navBgColor: string;
  logoBgColor: string;
  favicon: string;
  typeStyle: string;
  companyId: string;
  createdAt: string;
  updateAt: string;
  active: string;
};

const defaultTheme: ThemeConfig = {
  id: 0,
  uuid: 'Default',
  url: 'default',
  aplicationName: 'Vault',
  title: 'Vault',
  primaryColor: '#164F',
  secondaryColor: '#f37100',
  fontColor: '#000',
  logoBgColor: '#FFF',
  navBgColor: '#FFF',
  img: '',
  favicon: 'default',
  typeStyle: 'default',
  companyId: 'default',
  createdAt: 'default',
  updateAt: 'default',
  active: 'default'
};

const ThemeContext = createContext<ThemeConfig>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      const cached = sessionStorage.getItem('themeConfig');
      if (cached) {
        console.log('pegou do cash');
        setTheme(JSON.parse(cached));
        setIsLoading(false);

        return;
      }

      try {
        const hostname = window.location.hostname;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/styled?domain=${hostname}`
        );
        const data: ThemeConfig = await response.json();
        setTheme(data);
        sessionStorage.setItem('themeConfig', JSON.stringify(data));
      } catch (error) {
        console.error('Erro ao buscar tema:', error);
        setTheme(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheme();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </NextThemesProvider>
  );
}
