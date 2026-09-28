import { AccountForm } from '@/components/accounts/account-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Add Account | FinTrack',
};

export default function NewAccountPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Account</h1>
        <p className="text-muted-foreground">
          Create a new account to track your balances and transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Enter the initial details for your new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm />
        </CardContent>
      </Card>
    </div>
  );
}
