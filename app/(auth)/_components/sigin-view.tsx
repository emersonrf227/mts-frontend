'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { useTheme } from '@/components/layout/ThemeToggle/theme-provider';
import VaultLogo from '../../../public/images/Vault_Blue@4x.png';
export const metadata: Metadata = {
  title: 'Login',
  description: 'Realizar login'
};

export default function SignInViewPage() {
  const theme = useTheme(); // pega logo, cor primária, etc

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src={theme.img} alt="Logo" width={200} height={200} />
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div>
            <Image
              style={{ width: '25%' }}
              src={VaultLogo}
              alt="Logo"
              width={200}
              height={200}
            />
          </div>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bem vindo ao Vault {theme.aplicationName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre na sua conta e desbrave novos horizontes!
            </p>
          </div>
          <UserAuthForm />
          <div
            style={{
              width: '100%',
              backgroundColor: `${theme.logoBgColor}`,
              display: 'flex',
              justifyContent: 'center',
              padding: '10px',
              borderRadius: '5px'
            }}
          >
            <img src={theme.img} alt="Logo" width={150} height={150} />
          </div>
        </div>
      </div>
    </div>
  );
}
