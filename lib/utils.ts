import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/app/dashboard/kanban/_components/board-column';
import { TaskDragData } from '@/app/dashboard/kanban/_components/task-card';
import { format, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';
import { PAYMENTS_STATUS, PAYMENTS_TYPES } from '@/constants/data';
import { toast } from 'sonner';

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'
  }`;
}

export function removeEmptyAndUndefinedValues(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      if (value !== null && typeof value !== 'undefined' && value !== '') {
        return true;
      }
      return false;
    })
  );
}

export function formatMoney(value: number) {
  if (!value) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(value: string) {
  return format(parseISO(value), 'dd/MM/yyyy');
}

export function formatDateTime(value: string) {
  return format(parseISO(value), 'dd/MM/yyyy HH:mm');
}

function validCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf === '') return false;

  if (
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999' ||
    cpf === '01234567890'
  )
    return false;

  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;

  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;

  return true;
}

function validCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  const a = new Array<number>();
  const c = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let b = 0;
  for (let i = 0; i < 12; i++) {
    a[i] = parseInt(cnpj.charAt(i));
    b += a[i] * c[i + 1];
  }

  let x: number;
  if ((x = b % 11) < 2) {
    a[12] = 0;
  } else {
    a[12] = 11 - x;
  }

  b = 0;
  for (let y = 0; y < 13; y++) {
    b += a[y] * c[y];
  }

  if ((x = b % 11) < 2) {
    a[13] = 0;
  } else {
    a[13] = 11 - x;
  }

  if (
    parseInt(cnpj.charAt(12)) !== a[12] ||
    parseInt(cnpj.charAt(13)) !== a[13]
  ) {
    return false;
  }

  if (cnpj === '00000000000000') return false;

  return true;
}

export function isValidDocument(document: string): boolean {
  const sanitizedDocument = document.replace(/[^\d]+/g, '');

  if (sanitizedDocument.length === 11) {
    return validCPF(sanitizedDocument);
  } else {
    return validCNPJ(sanitizedDocument);
  }
}

export function getPaymentStatusByKey(key: string) {
  return PAYMENTS_STATUS.find((option) => option.key === key)?.label;
}

export function getPaymentTypeByKey(key: string) {
  return PAYMENTS_TYPES.find((option) => option.key === key)?.label;
}

export function getActualMonthStartAndEnd() {
  const date = new Date();

  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { start, end };
}

export function formatCpfCnpj(valor: string) {
  const apenasNumeros = valor.replace(/\D/g, '');

  if (apenasNumeros.length <= 11) {
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    return apenasNumeros
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,4})$/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
}

export function hideCpfCnpj(valor: string) {
  const apenasNumeros = valor.replace(/\D/g, '');

  if (apenasNumeros.length <= 11) {
    return apenasNumeros.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '***.$2.$3-**'
    );
  } else {
    return apenasNumeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.***.***/****-$5'
    );
  }
}

export async function downloadElementHtmlToPNG({
  elementHTMLId,
  fileNameDownload
}: {
  elementHTMLId: string;
  fileNameDownload: string;
}) {
  const element = document.getElementById(elementHTMLId);

  if (!element) return toast.error('Não foi possível fazer o download');

  const getFileName = fileNameDownload.split('.')[0];

  try {
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `${getFileName}.png`;
    link.click();
  } catch (error) {
    toast.error('Erro ao capturar o componente');
  }
}
