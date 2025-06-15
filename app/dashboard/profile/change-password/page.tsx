import UserResetPasswordForm from '@/app/password-reset/_components/user-reset-password-form';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Dashboard : Alterar senha'
};

export default function RechargePage() {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Alterar senha`} description="altere sua senha" />
        </div>
        <Separator />
        <div className="max-w-md">
          <UserResetPasswordForm showExitButton={false} />
        </div>
      </div>
    </PageContainer>
  );
}
