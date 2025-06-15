'use client';

import React from 'react';

import AccountService, {
  IExtractData,
  IExtractResponse
} from '@/services/account';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { LoaderIcon, ReceiptTextIcon, Undo2Icon } from 'lucide-react';
import {
  formatDateTime,
  formatMoney,
  getPaymentStatusByKey,
  getPaymentTypeByKey,
  removeEmptyAndUndefinedValues
} from '@/lib/utils';
import Pagination, { IPagination } from '@/components/ui/pagination';
import { format, lastDayOfMonth, startOfMonth } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import PixReturn from './pix-return';
import { Box } from '@/components/ui/box';
import { PAYMENTS_STATUS, PAYMENTS_TYPES } from '@/constants/data';
import { Receipt } from '@/components/receipt';

export default function PlataformPage() {
  const [data, setData] = React.useState<IExtractResponse>();
  const [loading, setLoading] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState<DateRange>({
    from: startOfMonth(new Date()),
    to: lastDayOfMonth(new Date())
  });
  const [status, setStatus] = React.useState<string>();
  const [type, setType] = React.useState<string>();
  const [showPixReturn, setShowPixReturn] = React.useState(false);
  const [pixReturnInfo, setPixReturnInfo] = React.useState<{
    value: number;
    endToEndId: string;
  }>();

  const [pagination, setPagination] = React.useState<IPagination>({
    count: 0,
    page: 1,
    perPage: 10
  });

  const [viewReceipt, setViewReceipt] = React.useState<{
    open: boolean;
    transaction: IExtractData | undefined;
  }>({
    open: false,
    transaction: undefined
  });

  async function fetchData() {
    setLoading(true);
    const res = await AccountService.getExtract(
      removeEmptyAndUndefinedValues({
        dateFrom: format(dateFilter.from!, 'yyyy-MM-dd'),
        dateTo: format(dateFilter.to!, 'yyyy-MM-dd'),
        status: status == 'all' ? undefined : status,
        type: type == 'all' ? undefined : type,
        limitPerPage: pagination.perPage,
        page: pagination.page
      })
    );
    setLoading(false);

    if (res.error) {
      toast.error('Erro ao carregar o extrato');
      return;
    }

    setPagination((prev) => ({
      ...prev,
      count: res.data?.pagination.count!
    }));

    setData(res.data);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [pagination.page]);

  function handlePageChange(page: number) {
    setPagination({
      ...pagination,
      page: page
    });
  }

  function handlePixReturn(value: number, endToEndId: string) {
    setPixReturnInfo({
      value,
      endToEndId
    });
    setShowPixReturn(true);
  }

  if (loading && !data)
    return (
      <div className="flex items-center justify-center p-60">
        <LoaderIcon className="animate-spin" />
      </div>
    );

  return (
    <>
      <PixReturn
        value={pixReturnInfo?.value!}
        endToEndId={pixReturnInfo?.endToEndId!}
        onOpenChange={(value) => setShowPixReturn(value)}
        open={showPixReturn}
      />
      <div className="mb-4 hidden items-center space-x-2 md:flex">
        <CalendarDateRangePicker onChange={setDateFilter} value={dateFilter} />
        <Box className="w-56">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Situação" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENTS_STATUS.map((option) => (
                <SelectItem key={option.key} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Box>
        <Box className="w-56">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENTS_TYPES.map((option) => (
                <SelectItem key={option.key} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Box>
        <Button onClick={fetchData} loading={loading}>
          Filtrar
        </Button>
      </div>
      <Table>
        <TableHeader className="bg-[#f5f8fe] dark:bg-inherit">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>SubTipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {loading && (
              <TableCell colSpan={10} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <LoaderIcon className="animate-spin" />
                </div>
              </TableCell>
            )}
          </TableRow>
          {data?.extract && data?.extract.length <= 0 ? (
            <TableCell colSpan={10} className="h-24 text-center">
              <span className="font-semibold">
                Nenhuma movimentação encontrada
              </span>
            </TableCell>
          ) : (
            data?.extract.map(({ transactionId, data: transaction }) => (
              <TableRow key={transactionId}>
                <TableCell>{transactionId}</TableCell>
                <TableCell>
                  {getPaymentStatusByKey(transaction.status)}
                </TableCell>
                <TableCell>{getPaymentTypeByKey(transaction.type)}</TableCell>
                <TableCell>{transaction.subType}</TableCell>
                <TableCell>{formatMoney(Number(transaction.amount))}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.email}</TableCell>
                <TableCell>{transaction.documentNumber}</TableCell>
                <TableCell>{formatDateTime(transaction.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  {transaction.subType === 'PIX' &&
                    transaction.status === 'COMPLETED' &&
                    transaction.type === 'CREDIT' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant={'link'}
                              onClick={() =>
                                handlePixReturn(
                                  Number(transaction.amount),
                                  transaction.endtoendId!
                                )
                              }
                            >
                              <Undo2Icon className="h-6 w-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Devolver</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                  {getPaymentStatusByKey(transaction.status) === 'Completado' &&
                    transaction.subType === 'PIX' && (
                      <Button
                        variant="link"
                        className="border-none bg-transparent p-0 hover:bg-transparent"
                        onClick={() => {
                          setViewReceipt({
                            open: true,
                            transaction
                          });
                        }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="h-full w-full">
                                <ReceiptTextIcon
                                  size={24}
                                  className="stroke-cyan-600"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Visualizar Comprovante</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination pagination={pagination} onChange={handlePageChange} />

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
