'use client';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import PixService from '@/services/pix';
import { EyeIcon, LoaderIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';

export default function PixTable() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);

  async function fetchData() {
    setLoading(true);
    const res = await PixService.getKeys();

    if (res.error) {
      setLoading(false);
      toast.error('Erro ao carregar as chaves PIX');
      return;
    }

    setLoading(false);

    if (res.data?.data) {
      setData(res.data?.data);
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Minhas Chaves`}
            description="Gerenciar as chaves PIX"
          />
          <Link
            href={'/dashboard/customers/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo
          </Link>
        </div>
        <Separator />
        <Table>
          <TableHeader className="bg-[#f5f8fe] dark:bg-inherit">
            <TableRow>
              <TableHead>fullName</TableHead>
              <TableHead>typePerson</TableHead>
              <TableHead>documentNumber</TableHead>
              <TableHead>phoneNumber</TableHead>
              <TableHead>email</TableHead>
              <TableHead>status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {loading && (
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <LoaderIcon className="animate-spin" />
                  </div>
                </TableCell>
              )}
            </TableRow>
            {data.map((customer) => (
              <TableRow key={customer.uuid}>
                <TableCell>{customer.fullName}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href={'/dashboard/customers/'}
                          className={cn(buttonVariants({ variant: 'link' }))}
                        >
                          {React.createElement(EyeIcon, {
                            className: 'h-6 w-6'
                          })}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Detalhes do cliente</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
