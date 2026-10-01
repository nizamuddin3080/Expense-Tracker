import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTransaction } from '@/server/queries/transaction.queries';
import { formatCurrency, formatDate, formatDateWithDay } from '@/lib/format';
import { TRANSACTION_TYPE_COLORS } from '@/lib/constants';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';
import { DeleteTransactionButton } from '@/components/transactions/delete-transaction-button';
import { TransactionType } from '@/types';

export default async function TransactionDetailPage({ params }: { params: { id: string } }) {
  const transaction = await getTransaction(params.id);

  if (!transaction) {
    notFound();
  }

  const typeEnum = transaction.type as TransactionType;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/transactions" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight flex-1">Transaction Details</h1>
        <div className="flex gap-2">
          <Link href={`/transactions/${transaction.id}/edit`} className={buttonVariants({ variant: 'outline' })}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <DeleteTransactionButton id={transaction.id} />
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className={`text-4xl font-bold ${TRANSACTION_TYPE_COLORS[typeEnum]}`}>
                {formatCurrency(transaction.amount.toString(), { showSign: true })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="text-xl font-medium capitalize">{transaction.type.toLowerCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDateWithDay(transaction.date)}</p>
            </div>
            
            {transaction.type === 'TRANSFER' ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">From Account</p>
                  <p className="font-medium">{transaction.account.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To Account</p>
                  <p className="font-medium">{transaction.toAccount?.name}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="font-medium">{transaction.account.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{transaction.category?.name || 'Uncategorized'}</p>
                </div>
              </>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Merchant</p>
              <p className="font-medium">{transaction.merchant || '-'}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Note</p>
              <p className="font-medium whitespace-pre-wrap">{transaction.note || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium text-sm">{formatDate(transaction.createdAt, 'dd MMM yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium text-sm">{formatDate(transaction.updatedAt, 'dd MMM yyyy HH:mm')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
