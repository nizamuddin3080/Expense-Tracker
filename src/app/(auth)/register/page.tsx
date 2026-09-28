import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Create an Account</h1>
        <p className="text-sm text-secondary-fg mt-2">Start tracking your expenses with FinTrack</p>
      </div>
      
      <div className="space-y-4">
        {/* Placeholder form */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input type="text" className="w-full h-10 px-3 rounded-md border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input type="email" className="w-full h-10 px-3 rounded-md border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input type="password" className="w-full h-10 px-3 rounded-md border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Create a password" />
        </div>
        <button className="w-full h-10 rounded-md bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
          Sign up
        </button>
      </div>
      
      <p className="text-center text-sm text-secondary-fg">
        Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
      </p>
    </div>
  );
}
