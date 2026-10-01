'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun, User, WalletCards, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session } = useSession();
  
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
          className="relative p-2 rounded-md text-secondary-fg hover:bg-secondary-bg hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 top-2 left-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="h-8 w-8 rounded-full bg-secondary-bg border border-border flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all focus:outline-none"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <User className="w-5 h-5 text-muted-fg" />
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-secondary-fg truncate">
                  {session?.user?.email || 'user@example.com'}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-secondary-bg transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
