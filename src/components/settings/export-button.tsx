'use client';

import { Button } from '@/components/ui/button';
import { exportTransactionsCSV, exportFullBackupJSON } from '@/server/actions/export.actions';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ExportDataSection() {
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingJSON, setIsExportingJSON] = useState(false);

  const handleExportCSV = async () => {
    try {
      setIsExportingCSV(true);
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
        toast.success('CSV Export successful');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred during export');
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setIsExportingJSON(true);
      const result = await exportFullBackupJSON();
      
      if (!result.success) {
        toast.error(result.error || 'Failed to export data');
        return;
      }
      
      if (result.data) {
        const blob = new Blob([result.data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fintrack_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('JSON Backup successful');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred during backup');
    } finally {
      setIsExportingJSON(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Download your transaction data or a full backup of all your data</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleExportCSV} disabled={isExportingCSV || isExportingJSON} variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {isExportingCSV ? 'Exporting...' : 'Export Transactions (CSV)'}
        </Button>
        <Button onClick={handleExportJSON} disabled={isExportingCSV || isExportingJSON} variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {isExportingJSON ? 'Exporting...' : 'Export Full Backup (JSON)'}
        </Button>
      </CardContent>
    </Card>
  );
}
