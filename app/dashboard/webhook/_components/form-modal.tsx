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
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import WebhookService, { IWebhookData } from '@/services/webhook';

export interface IProps {
  open?: boolean;
  typesAlreadyAdded?: string[];
  webhook?: IWebhookData;
  onOpenChange?: (value: boolean) => void;
  reload?: () => void;
}

const typeSchema = z.enum(
  [
    'PIX_PAY_IN',
    'PIX_PAY_OUT',
    'PIX_REVERSAL',
    'PIX_REVERSAL_OUT',
    'PIX_REFUND',
    'BILLPAYMENT',
    'CREDIT_CARD_OUT',
    'CREDIT_CARD_CHARGEBACK'
  ],
  {
    errorMap: (issue, _ctx) => {
      switch (issue.code) {
        case 'invalid_type':
          return { message: 'Selecione um tipo' };
        case 'invalid_enum_value':
          return { message: 'Selecione um tipo' };
        default:
          return { message: 'Selecione um tipo' };
      }
    }
  }
);

const typesSelect = [
  {
    value: 'PIX_PAY_IN',
    label: 'PIX_PAY_IN'
  },
  {
    value: 'PIX_PAY_OUT',
    label: 'PIX_PAY_OUT'
  },
  {
    value: 'PIX_REVERSAL',
    label: 'PIX_REVERSAL'
  },
  {
    value: 'PIX_REVERSAL_OUT',
    label: 'PIX_REVERSAL_OUT'
  },
  {
    value: 'PIX_REFUND',
    label: 'PIX_REFUND'
  },
  {
    value: 'BILLPAYMENT',
    label: 'BILLPAYMENT'
  },
  {
    value: 'CREDIT_CARD_OUT',
    label: 'CREDIT_CARD_OUT'
  },
  {
    value: 'CREDIT_CARD_CHARGEBACK',
    label: 'CREDIT_CARD_CHARGEBACK'
  }
];

const formSchema = z.object({
  callbackUrl: z.string().url('Digite uma URL válido'),
  username: z.string().min(2, 'Digite o usuário'),
  password: z.string().min(2, 'Digite a senha'),
  type: typeSchema,
  active: z.boolean()
});

export default function WebhookModal({
  open,
  onOpenChange,
  typesAlreadyAdded,
  webhook,
  reload
}: IProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      callbackUrl: '',
      username: '',
      password: '',
      active: true
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (webhook) {
      handleUpdate();
    } else {
      handleCreate();
    }
  }

  async function handleCreate() {
    setLoading(true);
    const res = await WebhookService.createWebhook({
      callbackUrl: form.getValues().callbackUrl,
      username: form.getValues().username,
      password: form.getValues().password,
      type: form.getValues().type,
      active: form.getValues().active
    });
    setLoading(false);
    if (res.error) {
      toast.error('Falha ao criar o webhook');
      return;
    }
    toast.success('Webhook criado com sucesso');
    onOpenChange!(false);
    reload!();
  }

  async function handleUpdate() {
    setLoading(true);
    const res = await WebhookService.updateWebhook(webhook!.uuid, {
      callbackUrl: form.getValues().callbackUrl,
      username: form.getValues().username,
      password: form.getValues().password,
      type: form.getValues().type,
      active: form.getValues().active
    });
    setLoading(false);
    if (res.error) {
      toast.error('Falha ao atualizar o webhook');
      return;
    }
    toast.success('Webhook atualizado com sucesso');
    onOpenChange!(false);
    reload!();
  }

  let types = typesSelect.filter((type) => {
    if (webhook) {
      return type.value == webhook.type
        ? true
        : !typesAlreadyAdded?.includes(type.value);
    }

    return !typesAlreadyAdded?.includes(type.value);
  });

  React.useEffect(() => {
    if (open) {
      form.clearErrors();
      if (webhook) {
        form.setValue('callbackUrl', webhook.callbackUrl);
        form.setValue('username', webhook.username);
        form.setValue('password', webhook.password);
        form.setValue('type', webhook.type as any);
        form.setValue('active', webhook.active);
      } else {
        form.setValue('callbackUrl', '');
        form.setValue('username', '');
        form.setValue('password', '');
        form.setValue('type', '' as any);
        form.setValue('active', true);
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Webhook</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pt-4"
                autoComplete="off"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <FormField
                    control={form.control}
                    name="callbackUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuário</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
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
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {types.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full flex-row items-center justify-between">
                  <div>
                    <Switch
                      checked={form.watch('active')}
                      onCheckedChange={() =>
                        form.setValue('active', !form.watch('active'))
                      }
                    />
                  </div>
                  <Button type="submit" loading={loading}>
                    {webhook ? 'Atualizar' : 'Adicionar'}
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
