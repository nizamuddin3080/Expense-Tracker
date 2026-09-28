import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Geist } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { NextAuthProvider } from '@/components/providers/session-provider';
import { Toaster } from 'sonner';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'FinTrack',
    template: '%s | FinTrack',
  },
  description: 'Personal Expense Tracker — Track your finances with clarity and precision.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                classNames: {
                  error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
                  success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
                  warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
                },
              }}
            />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
