import { notFound } from 'next/navigation';
import { getTransaction } from '@/server/queries/transaction.queries';
import { getAccounts } from '@/server/queries/account.queries';
import { getCategories } from '@/server/queries/category.queries';
import { TransactionForm } from '@/components/transactions/transaction-form';

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const [transaction, accounts, categories] = await Promise.all([
    getTransaction(params.id),
    getAccounts(),
    getCategories(),
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Transaction</h1>
        <p className="text-muted-foreground mt-2">Update your transaction details.</p>
      </div>

      <div className="p-6 bg-card border rounded-lg shadow-sm">
        <TransactionForm 
          accounts={accounts} 
          categories={categories} 
          initialData={transaction} 
        />
      </div>
    </div>
  );
}
