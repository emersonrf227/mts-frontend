'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import AuthService from '@/services/auth';
import { toast } from 'sonner';

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(4, { message: 'Entre com uma senha válida' }),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
      .regex(/[A-Z]/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula'
      })
      .regex(/[a-z]/, {
        message: 'A senha deve conter pelo menos uma letra minúscula'
      })
      .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'A senha deve conter pelo menos um caractere especial'
      }),
    confirmPassword: z
      .string()
      .min(4, { message: 'Entre com uma senha válida' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas diferentes',
    path: ['confirmPassword']
  });

type UserFormValue = z.infer<typeof formSchema>;

interface IProps {
  showExitButton?: boolean;
}

export default function UserResetPasswordForm({
  showExitButton = true
}: IProps) {
  const searchParams = useSearchParams();
  const isError = searchParams.get('error');
  const [loading, setLoading] = useState(false);
  const [passwordInputFocused, setPasswordInputFocused] = useState(false);

  const defaultValues = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    const response = await AuthService.resetPassword({
      currentPassword: data.currentPassword,
      newPassword: data.password
    });
    setLoading(false);
    if (response.error) {
      toast.error('Falha ao redefinir a senha');
      return;
    }

    toast.success(
      'Senha redefinida com sucesso, por favor faça login novamente',
      {
        duration: 6000
      }
    );
    await signOut();
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Falha</AlertTitle>
              <AlertDescription>Nova senha inválida</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha Atual</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite sua senha atual"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite sua nova senha"
                    disabled={loading}
                    {...field}
                    onFocus={() => setPasswordInputFocused(true)}
                    onBlur={() => setPasswordInputFocused(false)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {passwordInputFocused && (
            <p className="text-sm text-muted-foreground">
              A senha deve conter:
              <ul className="list-disc pl-5">
                <li>Pelo menos 8 caracteres</li>
                <li>Pelo menos uma letra maiúscula</li>
                <li>Pelo menos uma letra minúscula</li>
                <li>Pelo menos um número</li>
                <li>Pelo menos um caractere especial</li>
              </ul>
            </p>
          )}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nova Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirme sua senha..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className="ml-auto w-full text-white"
            type="submit"
          >
            Alterar
          </Button>
          {showExitButton && (
            <Button
              disabled={loading}
              className="ml-auto w-full text-white"
              type="button"
              variant={'danger'}
              onClick={handleLogout}
            >
              Sair
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}
