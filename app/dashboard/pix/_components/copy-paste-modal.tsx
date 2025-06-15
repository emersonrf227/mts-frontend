import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import PixService from '@/services/pix';
import { toast } from 'sonner';

export interface IProps {
  open?: boolean;
  amount: number;
  pixKey: string;
  name: string;
  onOpenChange?: (value: boolean) => void;
}

const formSchema = z.object({
  amount: z.coerce.number().min(1, 'Digite um valor'),
  name: z.any(),
  pixKey: z.string().min(1)
});

export default function CopyPasteModal({
  open,
  onOpenChange,
  amount,
  pixKey,
  name
}: IProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: amount,
      pixKey: pixKey,
      name: name
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await PixService.withdraw({
      externalId: uuidv4(),
      key: values.pixKey,
      name: values.name,
      amount: values.amount
    });

    if (res.error) {
      setLoading(false);
      const dataError = res.data?.data as any;
      if (dataError?.message) {
        toast.error(dataError?.message);
        return;
      }
      toast.error('Erro ao realizar o pagamento');
      return;
    }

    setLoading(false);

    toast.success('Pagamento realizado com sucesso');
    onOpenChange!(false);
  }

  React.useEffect(() => {
    if (open) {
      form.setValue('amount', amount);
      form.setValue('pixKey', pixKey);
      form.setValue('name', name);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pix Copia e Cola</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pt-4"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <FormField
                    control={form.control}
                    name="name"
                    disabled
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quem receberá</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <MoneyInput
                    form={form}
                    name="amount"
                    label="Valor"
                    disabled={form.watch('amount') > 0}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    Pagar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
