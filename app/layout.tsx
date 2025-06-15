import { auth } from '@/auth';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { SessionStorage } from '@/components/session-storage';

export const metadata: Metadata = {
  title: 'SmartPay Servicos',
  description: 'SmartPay Servicos',
  icons: {
    icon: { url: '/images/Vault_Blue.svg', type: 'image/svg+xml' }
  }
};

const font = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html
      lang="pt-br"
      className={`${font.className}`}
      suppressHydrationWarning={true}
    >
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <SessionStorage session={session} />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
