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
import { Input } from '@/components/ui/input';
import PixService, { IDecodeBarcodeResponse } from '@/services/pix';
import { toast } from 'sonner';
import CopyPasteModal from './copy-paste-modal';

export const formSchema = z.object({
  pix: z.string().min(20, 'Digite o código do Pix')
});

interface IFormPageProps {}

export default function FormPage({}: IFormPageProps) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [res, setRes] = React.useState<IDecodeBarcodeResponse>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pix: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const res = await PixService.decodeBarcode(values.pix);

    if (res.error) {
      setLoading(false);
      toast.error('Erro ao decodificar o código do Pix');
      return;
    }

    setLoading(false);

    setRes(res.data);

    setOpen(true);
  }

  return (
    <>
      <CopyPasteModal
        open={open}
        onOpenChange={setOpen}
        amount={Number(res?.data?.transactionAmount)}
        pixKey={res?.data?.pixKey ?? ''}
        name={res?.data?.merchantName ?? ''}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="pix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pix</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Copie e cole o código do Pix aqui"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between pb-5">
            <Button type="submit" loading={loading}>
              Pagar
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
