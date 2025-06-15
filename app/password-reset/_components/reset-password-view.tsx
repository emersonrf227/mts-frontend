import { Metadata } from 'next';
import Link from 'next/link';
import UserResetPasswordForm from './user-reset-password-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTheme } from '@/components/layout/ThemeToggle/theme-provider';

export const metadata: Metadata = {
  title: 'Redefinir senha',
  description: 'Realizar redefinir senha'
};

export default function ResetPasswordViewPage() {
  const theme = useTheme(); // pega logo, cor primária, etc

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/password-reset"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Redefinir senha
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src={theme.img} alt="Logo" width={200} height={200} />
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Redefinir senha
            </h1>
            <p className="text-sm text-muted-foreground">
              Realize o processo de redefinição de senha
            </p>
          </div>
          <UserResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
