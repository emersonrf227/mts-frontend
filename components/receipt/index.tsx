import { useEffect, useState } from 'react';

import {
  FileDownIcon,
  ReceiptTextIcon,
  Undo2Icon,
  FileX2Icon
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PixReturn from '@/app/dashboard/extract/_components/pix-return';

import {
  downloadElementHtmlToPNG,
  formatCpfCnpj,
  formatDateTime,
  formatMoney,
  hideCpfCnpj
} from '@/lib/utils';
import { useDataUserStore } from '@/lib/store';

import AccountServices from '@/services/account';
import { toast } from 'sonner';

interface ReceiptProps {
  uuidTransaction: string | undefined;
  open: boolean;
  handleClose: () => void;
}

interface IDataReceipt {
  identification: string;
  title: string;
  fileNameDownload: string;
  subtype: string;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  value: string;
  valueForReturn: number;
  endtoendId?: string;
  payer: {
    name: string;
    documentNumber: string | undefined;
    bankName: any;
  };
  recipient: {
    name: string;
    documentNumber: string | undefined;
    bankName: any;
  };
}

export function Receipt({ uuidTransaction, open, handleClose }: ReceiptProps) {
  const { data } = useDataUserStore();

  const [dataReceipt, setDataReceipt] = useState<IDataReceipt | undefined>(
    undefined
  );
  const [showPixReturn, setShowPixReturn] = useState(false);
  const [pixReturnInfo, setPixReturnInfo] = useState<{
    value: number;
    endToEndId: string;
  }>();

  const id_receipt = `receipt_${uuidTransaction}`;

  const userAuthenticated = {
    name: data.fullName,
    documentNumber: data.documentNumber,
    bankName: ''
  };

  function handleCloseDialog() {
    handleClose();

    setDataReceipt(undefined);
    setShowPixReturn(false);
    setPixReturnInfo({} as { value: number; endToEndId: string });
  }

  async function fetchTransactionForReceipt() {
    if (!uuidTransaction) {
      return toast.error('Necessário informar a transação');
    }

    try {
      const res =
        await AccountServices.getDataTransactionForReceipt(uuidTransaction);

      if (res.error || (res.data && res.data.statusCode !== 200)) {
        toast.error('Erro ao carregar o preventivo bloqueado');
        return;
      }

      if (!res.data?.data) {
        return toast.error('Transação não identificada');
      }

      const transaction_data = res.data?.data;

      const otherUser = {
        name: transaction_data.name ?? '',
        documentNumber: transaction_data.documentNumber ?? '',
        bankName: transaction_data.bankName ?? ''
      };

      setDataReceipt({
        identification: transaction_data.uuid,
        title: `Comprovante de ${
          transaction_data.type === 'DEBIT' ? 'Pagamento' : 'Recebimento'
        }`,
        fileNameDownload:
          transaction_data.type === 'DEBIT'
            ? 'comprovante_pagamento'
            : 'comprovante_recebimento',
        subtype: transaction_data.subType,
        type: transaction_data.type,
        date: formatDateTime(transaction_data.createdAt),
        value: formatMoney(Number(transaction_data.amount)),
        valueForReturn: Number(transaction_data.amount_for_return),
        endtoendId: transaction_data.endtoendId,
        payer:
          transaction_data.type === 'CREDIT' ? otherUser : userAuthenticated,
        recipient:
          transaction_data.type === 'CREDIT' ? userAuthenticated : otherUser
      });
    } catch {
      toast.error('Erro ao carregar comprovante da transação');
      handleCloseDialog();
    }
  }

  function handlePixReturn(value: number, endToEndId: string) {
    handleCloseDialog();

    setPixReturnInfo({
      value,
      endToEndId
    });
    setShowPixReturn(true);
  }

  useEffect(() => {
    if (open) {
      fetchTransactionForReceipt();
    }
  }, [open]);

  if (!uuidTransaction) return <></>;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogTitle className="flex items-center gap-2">
            {dataReceipt ? (
              <>
                <ReceiptTextIcon />
                {dataReceipt.title}
              </>
            ) : null}
          </DialogTitle>

          {!dataReceipt ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-zinc-100 p-4 text-zinc-500">
              <FileX2Icon size={40} />
              <h1 className="text-xl font-semibold">
                Não foi possível carregar o comprovante
              </h1>
            </div>
          ) : (
            <>
              <div
                id={id_receipt}
                className="flex flex-col gap-4 rounded-md bg-zinc-100 p-4"
              >
                <div>
                  <h4 className="font-bold text-zinc-900">
                    {dataReceipt.title}
                  </h4>
                  <span className="text-xs font-bold text-zinc-500">
                    {dataReceipt.date}
                  </span>

                  <div className="mt-4 flex w-full flex-col gap-1">
                    <h6 className="flex justify-between text-sm font-semibold text-zinc-900">
                      Sub-Tipo:{' '}
                      <span className="font-medium">{dataReceipt.subtype}</span>
                    </h6>
                    <h6 className="flex justify-between text-sm font-semibold text-zinc-900">
                      Identificador:{' '}
                      <span className="font-medium">
                        {dataReceipt.identification}
                      </span>
                    </h6>
                  </div>
                </div>

                <div className="flex flex-col pb-2">
                  <span className="text-sm font-medium text-zinc-900">
                    Valor
                  </span>
                  <span className="text-xl font-bold text-zinc-900">
                    {dataReceipt.value}
                  </span>
                </div>

                <hr className="border-zinc-300" />

                <h4 className="font-semibold text-zinc-900">Destinatário</h4>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black">Nome</span>
                  <span className="text-sm text-zinc-600">
                    {dataReceipt.recipient.name}
                  </span>
                </div>

                {!!dataReceipt.recipient.documentNumber && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black">CPF</span>
                    <span className="text-sm text-zinc-600">
                      {hideCpfCnpj(
                        formatCpfCnpj(dataReceipt.recipient.documentNumber)
                      )}
                    </span>
                  </div>
                )}

                {!!dataReceipt.recipient.bankName && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black">
                      Instituição
                    </span>
                    <span className="text-sm text-zinc-600">
                      {dataReceipt.recipient.bankName}
                    </span>
                  </div>
                )}

                <h4 className="font-semibold text-zinc-900">Pagador</h4>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black">Nome</span>
                  <span className="text-sm text-zinc-600">
                    {dataReceipt.payer.name}
                  </span>
                </div>

                {!!dataReceipt.payer.documentNumber && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black">CPF</span>
                    <span className="text-sm text-zinc-600">
                      {hideCpfCnpj(
                        formatCpfCnpj(dataReceipt.payer.documentNumber)
                      )}
                    </span>
                  </div>
                )}

                {!!dataReceipt.payer.bankName && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black">
                      Instituição
                    </span>
                    <span className="text-sm text-zinc-600">
                      {dataReceipt.payer.bankName}
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter>
                <div className="flex w-full flex-col gap-10 border-t-2 pt-4 sm:justify-center">
                  <div className="flex gap-4">
                    <Button
                      className="flex flex-1 gap-2"
                      onClick={() =>
                        downloadElementHtmlToPNG({
                          elementHTMLId: id_receipt,
                          fileNameDownload: 'comprovante_pagamento'
                        })
                      }
                    >
                      <FileDownIcon size={18} />
                      Baixar Comprovante
                    </Button>

                    {dataReceipt.type === 'CREDIT' && (
                      <Button
                        className="flex flex-1 gap-2 bg-amber-600 duration-200 hover:bg-amber-700"
                        onClick={() =>
                          handlePixReturn(
                            Number(dataReceipt.valueForReturn),
                            dataReceipt.endtoendId!
                          )
                        }
                      >
                        <Undo2Icon size={18} />
                        Devolver
                      </Button>
                    )}
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <PixReturn
        value={pixReturnInfo?.value!}
        endToEndId={pixReturnInfo?.endToEndId!}
        onOpenChange={(value) => setShowPixReturn(value)}
        open={showPixReturn}
      />
    </>
  );
}
