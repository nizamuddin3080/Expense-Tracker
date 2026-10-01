import Link from 'next/link';
import { getTransactions } from '@/server/queries/transaction.queries';
import { formatCurrency, formatDate } from '@/lib/format';
import { TRANSACTION_TYPE_COLORS } from '@/lib/constants';
import { TransactionType } from '@/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { TransactionFilters } from '@/components/transactions/transaction-filters';

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { search?: string; type?: string; accountId?: string; categoryId?: string; page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const filters = {
    search: searchParams.search,
    type: searchParams.type ? (searchParams.type as TransactionType) : undefined,
    accountId: searchParams.accountId,
    categoryId: searchParams.categoryId,
  };

  const { items: transactions, totalCount, nextCursor } = await getTransactions(filters, page, 50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Link href="/transactions/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Link>
      </div>
      
      <TransactionFilters />

      <Card>
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category/Account</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Merchant</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const typeEnum = tx.type as TransactionType;
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
                            {tx.type === 'TRANSFER' 
                              ? `${tx.account.name} -> ${tx.toAccount?.name || 'Unknown'}` 
                              : tx.account.name}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {tx.merchant || '-'}
                        </td>
                        <td className={`p-4 align-middle text-right font-medium ${TRANSACTION_TYPE_COLORS[typeEnum]}`}>
                          {formatCurrency(tx.amount.toString(), { showSign: true })}
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
  );
}
