'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/partners': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Parceiros', link: '/dashboard/parteners' }
  ],
  '/dashboard/styled-settings': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Aparência', link: '/dashboard/styled-settings' }
  ],
  '/dashboard/customers': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Clientes', link: '/dashboard/customers' }
  ],
  '/dashboard/customers/new': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Clientes', link: '/dashboard/customers' },
    { title: 'Novo cliente', link: '/dashboard/customers/new' }
  ],
  '/dashboard/pix/recharge': [
    { title: 'Pix', link: '#' },
    { title: 'Recarga', link: '/dashboard/pix/recharge' }
  ],
  '/dashboard/pix/withdraw': [
    { title: 'Pix', link: '#' },
    { title: 'Sacar', link: '/dashboard/pix/withdraw' }
  ],
  '/dashboard/pix/keys': [
    { title: 'Pix', link: '#' },
    { title: 'Minhas Chaves', link: '/dashboard/pix/keys' }
  ],
  '/dashboard/pix/copy-paste': [
    { title: 'Pix', link: '#' },
    { title: 'Copia e Cola', link: '/dashboard/pix/copy-paste' }
  ],
  '/dashboard/extract/balance': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Balanço', link: '/dashboard/extract/balance' }
  ],
  '/dashboard/extract/bank': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Bancário', link: '/dashboard/extract/bank' }
  ],
  '/dashboard/extract/plataform': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Plataforma', link: '/dashboard/extract/plataform' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ],
  '/dashboard/profile/change-password': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Alterar senha', link: '/dashboard/profile/change-password' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
