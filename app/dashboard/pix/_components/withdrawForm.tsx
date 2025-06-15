'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { MoneyInput } from '@/components/ui/money-input';
import { Input } from '@/components/ui/input';
import PixService from '@/services/pix';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { getPaymentStatusByKey, isValidDocument } from '@/lib/utils';
import { useHookFormMask } from 'use-mask-input';
import { IExtractData } from '@/services/account';
import { Receipt } from '@/components/receipt';

export const formSchema = z.object({
  externalId: z.string(),
  key: z.string().min(1, 'Digite a chave pix'),
  name: z.string().min(1, 'Digite o nome'),
  documentNumber: z
    .string()
    .refine(
      (value: string) => isValidDocument(value),
      'Digite um CPF/CNPJ válido.'
    ),
  amount: z.coerce.number().min(0.01, 'Digite um valor'),
  memo: z.string().min(1, 'Digite uma descrição')
});

interface IFormPageProps {}

export default function FormPage({}: IFormPageProps) {
  const [loading, setLoading] = React.useState(false);

  const [viewReceipt, setViewReceipt] = React.useState<{
    open: boolean;
    transaction: IExtractData | undefined;
  }>({
    open: false,
    transaction: undefined
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      externalId: uuidv4(),
      amount: 0.0,
      key: '',
      documentNumber: '',
      memo: '',
      name: ''
    }
  });

  const registerWithMask = useHookFormMask(form.register);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const res = await PixService.withdraw({
      externalId: values.externalId,
      key: values.key,
      amount: values.amount,
      memo: values.memo,
      documentNumber: values.documentNumber.replace(/\D/g, ''),
      name: values.name
    });

    if (res.error || (res.data && res.data.statusCode !== 200)) {
      setLoading(false);
      toast.error('Erro ao gerar o saque');
      return;
    }

    if (getPaymentStatusByKey(res.data!.data.status) === 'Falhou') {
      toast.error('O saque falhou! Não foi possível gerar comprovante.');
    } else {
      setViewReceipt({
        open: true,
        transaction: { ...res.data?.data } as IExtractData
      });
    }

    setLoading(false);

    form.reset();
    form.setValue('externalId', uuidv4());

    toast.success('Saque gerado com sucesso');
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pix</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite somente os numeros se for CPF/CNPJ ou telefone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MoneyInput form={form} name="amount" label="Valor" />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      {...registerWithMask('documentNumber', [
                        '999.999.999-99',
                        '99.999.999/9999-99'
                      ])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between pb-5">
            <Button type="submit" loading={loading}>
              Sacar
            </Button>
          </div>
        </form>
      </Form>

      <Receipt
        open={viewReceipt.open}
        handleClose={() =>
          setViewReceipt((prevState) => ({ ...prevState, open: false }))
        }
        uuidTransaction={viewReceipt.transaction?.uuid}
      />
    </>
  );
}
