import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAccount } from '@/server/queries/account.queries';
import { getTransactions } from '@/server/queries/transaction.queries';
import { formatCurrency, formatDate } from '@/lib/format';
import { TRANSACTION_TYPE_COLORS, ACCOUNT_TYPE_LABELS } from '@/lib/constants';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';
import { TransactionType } from '@/types';

export default async function AccountDetailPage({ params }: { params: { id: string } }) {
  const accountId = params.id;
  const account = await getAccount(accountId);

  if (!account) {
    notFound();
  }

  const { items: transactions } = await getTransactions({ accountId }, 1, 50);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/accounts" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight flex-1">Account Details</h1>
        <div className="flex gap-2">
          <Link href={`/accounts/${accountId}/edit`} className={buttonVariants({ variant: 'outline' })}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{account.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{ACCOUNT_TYPE_LABELS[account.type as keyof typeof ACCOUNT_TYPE_LABELS]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(account.currentBalance, { currency: account.currency })}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Opening Balance</p>
              <p className="font-medium">{formatCurrency(account.openingBalance.toString(), { currency: account.currency })}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{account.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Details</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No transactions found for this account.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const typeEnum = tx.type as TransactionType;
                      // Handle transfer amount display based on if this is the source or dest account
                      const isTransferIn = tx.type === 'TRANSFER' && tx.toAccountId === accountId;
                      const displayAmount = isTransferIn ? tx.amount : (tx.type === 'EXPENSE' || tx.type === 'TRANSFER' ? `-${tx.amount}` : tx.amount);
                      
                      return (
                        <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle whitespace-nowrap">
                            <Link href={`/transactions/${tx.id}`} className="hover:underline">
                              {formatDate(tx.date)}
                            </Link>
                          </td>
                          <td className="p-4 align-middle capitalize">
                            {tx.type.toLowerCase()}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="font-medium">
                              {tx.type === 'TRANSFER' ? 'Transfer' : (tx.category?.name || 'Uncategorized')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {tx.merchant || (tx.type === 'TRANSFER' ? (isTransferIn ? `From: ${tx.account.name}` : `To: ${tx.toAccount?.name}`) : '-')}
                            </div>
                          </td>
                          <td className={`p-4 align-middle text-right font-medium ${isTransferIn ? TRANSACTION_TYPE_COLORS['INCOME'] : TRANSACTION_TYPE_COLORS[typeEnum]}`}>
                            {formatCurrency(displayAmount.toString(), { showSign: true })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
