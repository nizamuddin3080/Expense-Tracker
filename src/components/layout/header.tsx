'use client';

import { useTheme } from 'next-themes';
import { Menu, Moon, Sun, User, WalletCards } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  // Basic title logic based on pathname
  let title = 'Dashboard';
  if (pathname.includes('/transactions')) title = 'Transactions';
  else if (pathname.includes('/accounts')) title = 'Accounts';
  else if (pathname.includes('/categories')) title = 'Categories';
  else if (pathname.includes('/budgets')) title = 'Budgets';
  else if (pathname.includes('/goals')) title = 'Goals';
  else if (pathname.includes('/recurring')) title = 'Recurring';
  else if (pathname.includes('/reports')) title = 'Reports';
  else if (pathname.includes('/settings')) title = 'Settings';

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 md:h-16 px-4 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu and logo */}
        <div className="lg:hidden flex items-center gap-3">
          <button className="p-2 -ml-2 rounded-md text-secondary-fg hover:bg-secondary-bg focus:outline-none focus:ring-2 focus:ring-primary">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-primary font-bold">
             <WalletCards className="w-5 h-5" />
             <span className="hidden sm:inline">FinTrack</span>
          </div>
        </div>
        
        {/* Desktop title */}
        <h1 className="hidden lg:block text-xl font-semibold text-foreground capitalize">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md text-secondary-fg hover:bg-secondary-bg hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
        
        <div className="h-8 w-8 rounded-full bg-secondary-bg border border-border flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
          <User className="w-5 h-5 text-muted-fg" />
        </div>
      </div>
    </header>
  );
}
