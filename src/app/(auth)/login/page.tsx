import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-sm text-secondary-fg mt-2">Log in to your FinTrack account</p>
      </div>
      
      <div className="space-y-4">
        {/* Placeholder form */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input type="email" className="w-full h-10 px-3 rounded-md border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input type="password" className="w-full h-10 px-3 rounded-md border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your password" />
        </div>
        <button className="w-full h-10 rounded-md bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
          Log in
        </button>
      </div>
      
      <p className="text-center text-sm text-secondary-fg">
        Don&apos;t have an account? <Link href="/register" className="text-primary hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
