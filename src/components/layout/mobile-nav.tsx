'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, List, Plus, Wallet, MoreHorizontal } from 'lucide-react';
import { QuickAddModal } from '@/components/transactions/quick-add-modal';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: List, label: 'History', href: '/transactions' },
    { isFab: true, icon: Plus, label: 'Add', href: '/transactions/new' },
    { icon: Wallet, label: 'Accounts', href: '/accounts' },
    { icon: MoreHorizontal, label: 'More', href: '/settings' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-50 pb-safe">
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        
        if (item.isFab) {
          return (
            <div key="fab" className="relative -top-5 flex flex-col items-center justify-center">
              <QuickAddModal />
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-fg hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
