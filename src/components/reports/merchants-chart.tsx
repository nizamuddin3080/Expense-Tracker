'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/format';

interface Props {
  data: {
    merchant: string;
    amount: number;
  }[];
}

export function MerchantsChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis 
            type="category" 
            dataKey="merchant" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            formatter={(value: any) => [formatCurrency(value), 'Amount']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
