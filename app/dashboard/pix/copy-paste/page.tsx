import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import Form from '../_components/copy-pasteForm';

export const metadata = {
  title: 'Dashboard : Pix Copia e Cola'
};

export default function RechargePage() {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Pix Copia e Cola`} description="Faça pagamento" />
        </div>
        <Separator />
        <Form />
      </div>
    </PageContainer>
  );
}
