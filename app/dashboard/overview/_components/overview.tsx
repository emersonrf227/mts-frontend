'use client';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import PlataformPageExtract from '@/app/dashboard/extract/_components/plataform-page';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import AccountService, {
  IBalanceResponse,
  IGetTotalMED,
  IQtdPixInAndOutResponse,
  IValuesByMonthResponse
} from '@/services/account';
import { formatMoney } from '@/lib/utils';

export default function OverViewPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20)
  });

  const [valuesByMonth, setValuesByMonth] = React.useState<
    IValuesByMonthResponse | undefined
  >();
  const [qtdPixInAndOut, setQtdPixInAndOut] = React.useState<
    IQtdPixInAndOutResponse | undefined
  >();
  const [balance, setBalance] = React.useState<IBalanceResponse | undefined>();
  const [med, setMed] = React.useState<IGetTotalMED | undefined>();

  const [loading, setLoading] = React.useState(false);

  async function fetchTotalMED() {
    try {
      const res = await AccountService.getTotalMED();

      if (res.error || (res.data && res.data.statusCode !== 200)) {
        toast.error('Erro ao carregar o preventivo bloqueado');
        return;
      }

      setMed(res.data);
    } catch {
      toast.error('Erro ao carregar o preventivo bloqueado');
    }
  }

  async function fecthQtdPixInAndOut() {
    try {
      const res = await AccountService.getQtdPixInAndOut();

      if (res.error || (res.data && res.data.statusCode !== 200)) {
        toast.error('Erro ao carregar a quantidade de pix de entrada e saída');
        return;
      }

      setQtdPixInAndOut(res.data);
    } catch {
      toast.error('Erro ao carregar a quantidade de pix de entrada e saída');
    }
  }

  async function fecthGetValuesByMonth() {
    try {
      const res = await AccountService.getValuesByMonth();

      if (res.error || (res.data && res.data.statusCode !== 200)) {
        toast.error('Erro ao carregar os valores do mês');
        return;
      }

      setValuesByMonth(res.data);
    } catch {
      toast.error('Erro ao carregar os valores do mês');
    }
  }

  async function fetchBalance() {
    const res = await AccountService.getBalance();

    if (res.error) {
      toast.error('Erro ao carregar o balanço');
      return;
    }

    setBalance(res.data);
  }

  React.useEffect(() => {
    Promise.all([
      fetchTotalMED(),
      fecthGetValuesByMonth(),
      fecthQtdPixInAndOut(),
      fetchBalance()
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Oi, Bem-vindo 👋
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <div className="rounded-full bg-slate-300 p-2 dark:bg-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold ">
                {!balance ? '-----' : formatMoney(balance.balance)}{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">
                Total Mensal (Entrada)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold text-green-700">
                {!valuesByMonth
                  ? '-----'
                  : formatMoney(valuesByMonth.totalEntries)}{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">
                Total Mensal (Saida)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold text-red-700">
                {!valuesByMonth
                  ? '-----'
                  : formatMoney(valuesByMonth.totalExits)}{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Preventivo Bloqueado (MED)
              </CardTitle>
              <div className="rounded-full bg-slate-300 p-2 dark:bg-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold ">
                {!med ? '-----' : formatMoney(med.totalMED)}{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estorno (Entrada)
              </CardTitle>
              <div className="rounded-full bg-slate-300 p-2 dark:bg-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold ">
                R$ 0,00{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estorno (Saida)
              </CardTitle>
              <div className="rounded-full bg-slate-300 p-2 dark:bg-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold ">
                R$ 0,00{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pix/Min</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold ">
                1 {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa (Entrada)
              </CardTitle>
              <div className="rounded-full bg-slate-300 p-2 dark:bg-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold ">
                R$ 0,00{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa (Saida)
              </CardTitle>
              <div className="rounded-full bg-slate-300 p-2 dark:bg-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold ">
                R$ 0,00{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Nº de Pix (Entrada)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold text-green-700">
                {!qtdPixInAndOut ? '-----' : qtdPixInAndOut.count_pix_entries}{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Nº de Pix (Saida)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex text-2xl font-bold text-red-700">
                {!qtdPixInAndOut ? '-----' : qtdPixInAndOut.count_pix_exits}{' '}
                {loading ? <LoaderIcon className="animate-spin" /> : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-start justify-between pb-5 pt-10">
        <Heading
          title={`Extrato Plataforma`}
          description="Verifique o extrato"
        />
      </div>

      <PlataformPageExtract />
    </PageContainer>
  );
}
