'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  List, 
  Wallet, 
  Grid, 
  PieChart, 
  Target, 
  Repeat, 
  BarChart, 
  Settings,
  ChevronLeft,
  ChevronRight,
  WalletCards
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: List, label: 'Transactions', href: '/transactions' },
  { icon: Wallet, label: 'Accounts', href: '/accounts' },
  { icon: Grid, label: 'Categories', href: '/categories' },
  { icon: PieChart, label: 'Budgets', href: '/budgets' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: Repeat, label: 'Recurring', href: '/recurring' },
  { icon: BarChart, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <WalletCards className="w-6 h-6" />
            <span>FinTrack</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="mx-auto text-primary">
            <WalletCards className="w-6 h-6" />
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-secondary-fg hover:bg-secondary-bg hover:text-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-fg")} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center p-2 rounded-md text-muted-fg hover:bg-secondary-bg hover:text-foreground transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
