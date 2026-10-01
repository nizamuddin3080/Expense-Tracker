'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { importTransactionsCSV } from '@/server/actions/import.actions';
import { toast } from 'sonner';

interface Account {
  id: string;
  name: string;
}

interface ImportFormProps {
  accounts: Account[];
}

export function ImportForm({ accounts }: ImportFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [accountId, setAccountId] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
    }
  };

  const handleImport = async () => {
    if (!file || !accountId) {
      toast.error('Please select a file and an account');
      return;
    }

    setIsImporting(true);
    setResults(null);

    try {
      const text = await file.text();
      const res = await importTransactionsCSV(text, accountId);

      if (res.success && res.data) {
        setResults(res.data);
        toast.success(`Imported ${res.data.imported} transactions`);
      } else {
        toast.error((res as any).error || 'Failed to import CSV');
      }
    } catch (error) {
      toast.error('An error occurred during import');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="account">Select Account</Label>
        <Select value={accountId} onValueChange={(val) => setAccountId(val || '')}>
          <SelectTrigger id="account">
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>
                {acc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">CSV File</Label>
        <Input id="file" type="file" accept=".csv" onChange={handleFileChange} />
      </div>

      <Button onClick={handleImport} disabled={!file || !accountId || isImporting}>
        {isImporting ? 'Importing...' : 'Import Transactions'}
      </Button>

      {results && (
        <div className="mt-4 p-4 border rounded-md bg-muted/50 text-sm">
          <h4 className="font-semibold mb-2">Import Results</h4>
          <p className="text-green-600">Successfully imported: {results.imported}</p>
          <p className="text-amber-600">Skipped (duplicates/invalid): {results.skipped}</p>
          {results.errors.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              <p className="font-semibold text-red-600">Errors:</p>
              <ul className="list-disc pl-4 text-xs text-red-500">
                {results.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
