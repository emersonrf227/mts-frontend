import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import Form from '../_components/withdrawForm';

export const metadata = {
  title: 'Dashboard : Sacar'
};

export default function RechargePage() {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Sacar`} description="Faça o saque" />
        </div>
        <Separator />
        <Form />
      </div>
    </PageContainer>
  );
}
