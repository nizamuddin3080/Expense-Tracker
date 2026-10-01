import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ProfileForm } from '@/components/settings/profile-form';
import { ChangePasswordForm } from '@/components/settings/change-password-form';
import { ExportDataSection } from '@/components/settings/export-button';
import { ImportForm } from '@/components/settings/import-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Settings - FinTrack',
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const accounts = await db.account.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <ProfileForm 
          initialData={{
            name: session.user.name || '',
            email: session.user.email || '',
          }} 
        />
        <ChangePasswordForm />
        
        <Card>
          <CardHeader>
            <CardTitle>Import Transactions</CardTitle>
            <CardDescription>Upload a CSV file to import transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ImportForm accounts={accounts} />
          </CardContent>
        </Card>

        <ExportDataSection />
      </div>
    </div>
  );
}
