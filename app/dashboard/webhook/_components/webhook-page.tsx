'use client';

import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { LoaderIcon, Pencil, Plus, Trash2Icon } from 'lucide-react';
import WebhookService, { IWebhookData } from '@/services/webhook';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import WebhookModal from './form-modal';
import { AlertModal } from '@/components/modal/alert-modal';

export default function WebhookPage() {
  const [data, setData] = React.useState<IWebhookData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedWebhook, setSelectedWebhook] = React.useState<IWebhookData>();
  const [showModalDelete, setShowModalDelete] = React.useState(false);

  async function fetchData() {
    setLoading(true);
    const response = await WebhookService.getWebhooks();

    setLoading(false);

    if (response.error) {
      toast.error('Falha ao carregar os webhooks');
      return;
    }
    if (response.data?.data) {
      if (Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([response.data.data]);
      }
    }
  }

  function handleEditWebhook(webhook: IWebhookData) {
    setSelectedWebhook(webhook);
    setOpen(true);
  }

  function handleDeleteWebhook(webhook: IWebhookData) {
    setSelectedWebhook(webhook);
    setShowModalDelete(true);
  }

  function handleCloseModal(value: boolean) {
    setOpen(value);
    if (!value) {
      setSelectedWebhook(undefined);
    }
  }

  async function onConfirm() {
    setLoading(true);
    const res = await WebhookService.deleteWebhook(selectedWebhook!.uuid);
    setLoading(false);
    setShowModalDelete(false);
    if (res.error) {
      toast.error('Falha ao excluir o webhook');
      return;
    }
    toast.success('Webhook excluído com sucesso');
    fetchData();
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AlertModal
        isOpen={showModalDelete}
        onClose={() => setShowModalDelete(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <WebhookModal
        open={open}
        onOpenChange={handleCloseModal}
        typesAlreadyAdded={data.map((webhook) => webhook.type)}
        webhook={selectedWebhook}
        reload={fetchData}
      />
      <PageContainer scrollable>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <Heading title={`Webhook`} description="Configurações do Webhook" />
            <Button
              onClick={() => setOpen(true)}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </div>
          <Separator />
          <Table>
            <TableHeader className="bg-[#f5f8fe] dark:bg-inherit">
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <LoaderIcon className="animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {data.length > 0 &&
                data.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>{webhook.callbackUrl}</TableCell>
                    <TableCell>{webhook.type}</TableCell>
                    <TableCell>
                      {webhook.active ? 'Ativo' : 'Inativo'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => handleEditWebhook(webhook)}
                      >
                        <Pencil className="text-primary" />
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => handleDeleteWebhook(webhook)}
                      >
                        <Trash2Icon className="text-danger" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </PageContainer>
    </>
  );
}
