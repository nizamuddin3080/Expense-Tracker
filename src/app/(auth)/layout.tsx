export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-bg p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-md p-8">
        {children}
      </div>
    </div>
  );
}
