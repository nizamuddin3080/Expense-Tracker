'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/format';

interface Props {
  data: {
    accountName: string;
    balance: number;
    type: string;
  }[];
}

export function AccountBalanceChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="accountName" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            formatter={(value: any) => [formatCurrency(value), 'Balance']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          <Bar dataKey="balance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
