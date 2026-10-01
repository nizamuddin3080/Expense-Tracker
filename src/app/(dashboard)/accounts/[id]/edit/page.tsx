import { notFound } from 'next/navigation';
import { getAccount } from '@/server/queries/account.queries';
import { EditAccountForm } from '@/components/accounts/edit-account-form';

export default async function EditAccountPage({ params }: { params: { id: string } }) {
  const account = await getAccount(params.id);

  if (!account) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Account</h1>
        <p className="text-muted-foreground mt-2">Update your account details and settings.</p>
      </div>

      <div className="p-6 bg-card border rounded-lg shadow-sm">
        <EditAccountForm account={account} />
      </div>
    </div>
  );
}
