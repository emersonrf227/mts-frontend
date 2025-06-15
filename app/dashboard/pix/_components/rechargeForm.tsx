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
import PixService, { IRechargeData, IStatusInvoiceData } from '@/services/pix';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import Countdown from 'react-countdown';
import { isValidDocument } from '@/lib/utils';
import { EXPIRE_PIX_TIME } from '@/constants/data';
import { useHookFormMask } from 'use-mask-input';

export const formSchema = z.object({
  amount: z.coerce
    .number()
    .transform((v) => Number(v))
    .refine((v) => v > 0, 'Digite um valor'),
  documentNumber: z
    .string()
    .refine(
      (cpf: string) => isValidDocument(cpf),
      'Digite um CPF/CNPJ válido.'
    ),
  name: z.string().min(1, 'Digite um nome'),
  identification: z.string().min(1, 'Digite um identificador'),
  description: z.any()
});

interface IFormPageProps {}

type CountdownState = {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

export default function FormPage({}: IFormPageProps) {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<IRechargeData>();
  const [showModalPix, setShowModalPix] = React.useState(false);
  const [statusPix, setStatusPix] = React.useState<IStatusInvoiceData>();
  const [expireTime, setExpireTime] = React.useState<number>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0.0,
      description: ''
    }
  });

  const registerWithMask = useHookFormMask(form.register);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await PixService.recharge({
      externalId: uuidv4(),
      amount: values.amount,
      description: values.description,
      document: values.documentNumber.replace(/\D/g, ''),
      name: values.name,
      identification: values.identification,
      expire: EXPIRE_PIX_TIME
    });

    if (res.error) {
      setLoading(false);
      toast.error('Erro ao gerar o pagamento');
      return;
    }

    setLoading(false);

    setData(res.data?.data);

    setShowModalPix(true);

    toast.success('QR Code gerado com sucesso');
  }

  async function checkStatus() {
    const res = await PixService.statusPix(data?.identifier!);

    if (res.error) {
      toast.error('Erro ao verificar o status');
      return;
    }

    setStatusPix(res.data?.data);
  }

  function handleCopy(value: string) {
    navigator.clipboard.writeText(value);
    toast.success('Copiado com sucesso');
  }

  const renderer = ({ minutes, seconds, completed }: CountdownState) => {
    if (completed) {
      setShowModalPix(false);
      setData(undefined);
      return null;
    } else {
      return (
        <span className="font-semibold">
          {minutes} : {seconds}
        </span>
      );
    }
  };

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showModalPix) {
      intervalId = setInterval(() => {
        checkStatus();
      }, 6000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [showModalPix]);

  React.useEffect(() => {
    if (showModalPix) setExpireTime(Date.now() + EXPIRE_PIX_TIME);

    return () => {
      setExpireTime(undefined);
    };
  }, [showModalPix]);

  return (
    <Form {...form}>
      <Dialog open={showModalPix} onOpenChange={setShowModalPix}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faça o pagamento</DialogTitle>
            <DialogDescription>
              {data &&
                data.status === 'CREATED' &&
                statusPix?.status !== 'DONE' && (
                  <div className="flex w-full flex-col items-center justify-center gap-2 pt-5">
                    <QRCodeCanvas value={data.key} size={256} />
                    <Input className="w-64" value={data.key} />
                    <Button
                      className="flex items-center gap-1"
                      type="button"
                      onClick={() => handleCopy(data.key)}
                    >
                      {' '}
                      <Copy /> Copiar{' '}
                    </Button>
                    <Countdown date={expireTime} renderer={renderer} />
                    <span className="text-xl font-semibold">
                      Aguardando o pagamento
                    </span>
                  </div>
                )}
              {statusPix && statusPix.status === 'DONE' && (
                <div className="flex w-full flex-col items-center justify-center gap-2 pt-5">
                  <div className="flex flex-col items-center" data-id="3">
                    <svg
                      data-id="4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-16 w-16 text-green-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    <h1
                      className="mt-4 text-center text-3xl font-bold text-gray-900 dark:text-gray-50"
                      data-id="5"
                    >
                      Pagamento recebido com sucesso
                    </h1>
                  </div>
                  <Button
                    className="flex items-center gap-1"
                    type="button"
                    onClick={() => setShowModalPix(false)}
                  >
                    Fechar
                  </Button>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            name="identification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificação</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
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
        <div className="flex justify-center lg:justify-start">
          <Button type="submit" loading={loading}>
            Gerar
          </Button>
        </div>
      </form>
    </Form>
  );
}
