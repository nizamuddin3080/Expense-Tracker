'use client';

import { Button } from '@/components/ui/button';
import { exportTransactionsCSV } from '@/server/actions/export.actions';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ExportDataSection() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const result = await exportTransactionsCSV();
      
      if (!result.success) {
        toast.error(result.error || 'Failed to export data');
        return;
      }
      
      if (result.data) {
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Export successful');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred during export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Download all your transaction data as a CSV file</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} disabled={isExporting} variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Transactions (CSV)'}
        </Button>
      </CardContent>
    </Card>
  );
}
