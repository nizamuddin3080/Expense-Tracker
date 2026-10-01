'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export function TransactionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'ALL');

  // Simple debounce implementation inside component
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      
      if (type && type !== 'ALL') {
        params.set('type', type);
      } else {
        params.delete('type');
      }
      
      params.delete('page'); // Reset page on filter change
      
      router.push(`?${params.toString()}`);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, type, router, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search merchant or note..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="w-full sm:w-48">
        <Select value={type} onValueChange={(val) => setType(val as string)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="TRANSFER">Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
