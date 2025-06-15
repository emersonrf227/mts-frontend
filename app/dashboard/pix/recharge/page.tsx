import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import RechargeForm from '../_components/rechargeForm';

export const metadata = {
  title: 'Dashboard : Pix Recarga'
};

export default function RechargePage() {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Recarregar`}
            description="Faça o recargamento no PIX"
          />
        </div>
        <Separator />
        <RechargeForm />
      </div>
    </PageContainer>
  );
}
