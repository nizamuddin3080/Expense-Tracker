import { getAccounts } from '@/server/queries/account.queries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { AccountType } from '@/types';

export const metadata = {
  title: 'Accounts | FinTrack',
};

// Helper to safely get the correct icon component
const IconComponent = ({ iconName, className }: { iconName: string; className?: string }) => {
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Wallet;
  return <Icon className={className} />;
};

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="flex flex-col space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your cash, bank accounts, credit cards, and digital wallets.
          </p>
        </div>
        <Button asChild>
          <Link href="/accounts/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Link>
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <LucideIcons.Wallet className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No accounts added</h2>
            <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
              You don&apos;t have any accounts yet. Add your first account to start tracking your finances.
            </p>
            <Button asChild className="mt-6">
              <Link href="/accounts/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const typeLabel = ACCOUNT_TYPE_LABELS[account.type as AccountType] || account.type;
            const iconName = account.icon || ACCOUNT_TYPE_ICONS[account.type as AccountType] || 'Wallet';
            
            return (
              <Card key={account.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {account.name}
                  </CardTitle>
                  <IconComponent iconName={iconName} className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(account.currentBalance, { currency: account.currency })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {typeLabel}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
