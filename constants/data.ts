import { NavItem } from '@/types';

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Extratos',
    url: '#',
    icon: 'extract',
    isActive: false,
    items: [
      {
        title: 'Plataforma',
        url: '/dashboard/extract/plataform'
      }
    ]
  },
  {
    title: 'Pix',
    url: '#',
    icon: 'pix',
    isActive: false,
    items: [
      // {
      //   title: 'Minhas Chaves',
      //   url: '/dashboard/pix/keys'
      // },
      {
        title: 'Recarregar',
        url: '/dashboard/pix/recharge'
      },
      {
        title: 'Sacar',
        url: '/dashboard/pix/withdraw'
      },
      {
        title: 'Copia e Cola',
        url: '/dashboard/pix/copy-paste'
      }
    ] // No child items
  },
  {
    title: 'Webhook',
    url: '/dashboard/webhook',
    icon: 'webhook',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  }
];

export const EXPIRE_PIX_TIME = 1800000;

export const PAYMENTS_STATUS = [
  { key: 'all', value: 'all', label: 'Todos' },
  { key: 'NEW', value: 'NEW', label: 'Novo' },
  { key: 'AWAITING', value: 'AWAITING', label: 'Aguardando' },
  { key: 'COMPLETED', value: 'COMPLETED', label: 'Completado' },
  { key: 'ERROR', value: 'ERROR', label: 'Erro' },
  { key: 'REFUNDED', value: 'REFUNDED', label: 'Reembolso' },
  { key: 'FAILED', value: 'FAILED', label: 'Falhou' },
  { key: 'DROP', value: 'DROP', label: 'Desistiu' },
  { key: 'CANCEL', value: 'CANCEL', label: 'Cancelou' },
  { key: 'TESTING', value: 'TESTING', label: 'Testando' }
];

export const PAYMENTS_TYPES = [
  { key: 'all', value: 'all', label: 'Todos' },
  { key: 'CREDIT', value: 'CREDIT', label: 'Crédito' },
  { key: 'DEBIT', value: 'DEBIT', label: 'Débito' }
];
