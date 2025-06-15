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

export interface IPixReturnProps {
  open?: boolean;
  value: number;
  endToEndId: string;
  onOpenChange?: (value: boolean) => void;
}

const formSchema = z.object({
  amount: z.coerce.number().min(1),
  end2end: z.string().min(1),
  description: z.string(),
  externalId: z.string()
});

export default function PixReturn({
  open,
  onOpenChange,
  value,
  endToEndId
}: IPixReturnProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: value,
      end2end: endToEndId,
      description: '',
      externalId: uuidv4()
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await PixService.pixReturn({
      externalId: values.externalId,
      end2end: values.end2end,
      description: values.description,
      amount: values.amount
    });

    if (res.error) {
      setLoading(false);
      if (res.data?.message) {
        toast.error(res.data?.message);
        return;
      }
      toast.error('Erro ao devolver o pagamento');
      return;
    }

    setLoading(false);

    toast.success('Pagamento devolvido com sucesso');
    onOpenChange!(false);
  }

  React.useEffect(() => {
    if (open) {
      form.setValue('amount', value);
      form.setValue('end2end', endToEndId);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pix Devolução</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pt-4"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <MoneyInput
                    form={form}
                    name="amount"
                    label="Valor"
                    disabled
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
                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    Devolver
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
