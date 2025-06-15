import AppSidebar from '@/components/layout/app-sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DubaiCash',
  description: 'DubaiCash'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar>{children}</AppSidebar>
    </>
  );
}
