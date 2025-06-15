import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import Page from '../_components/plataform-page';

export const metadata = {
  title: 'Dashboard : Extrato Plataforma'
};

export default function PlataformPage() {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Extrato Plataforma`}
            description="Verifique o extrato"
          />
        </div>
        <Separator />
       <Page />
      </div>
    </PageContainer>
  );
}
