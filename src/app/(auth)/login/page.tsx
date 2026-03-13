import Link from "next/link";
import { login } from "../actions";
import PasswordField from "@/components/auth/PasswordField";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md w-full">
      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center justify-center gap-2 mb-8 text-slate-900 dark:text-white">
        <div className="size-8 bg-primary rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl">database</span>
        </div>
        <span className="text-xl font-bold">Vetro</span>
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sign In</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Welcome back to Vetro sales AI.
      </p>

      {message && (
        <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${
          message.toLowerCase().includes('check') || message.toLowerCase().includes('success')
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-10">
        <form action={login} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">
              Email Address
            </label>
            <div className="mt-1">
              <input
                autoComplete="email"
                className="block w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm text-slate-900 dark:text-white"
                id="email"
                name="email"
                placeholder="you@company.com"
                required
                type="email"
                suppressHydrationWarning
              />
            </div>
          </div>
          <PasswordField 
            label="Password" 
            name="password"
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label className="ml-2 block text-sm text-slate-700 dark:text-slate-400" htmlFor="remember-me">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link className="font-medium text-primary hover:text-primary/80" href="/reset">
                Forgot Password?
              </Link>
            </div>
          </div>
          <div>
            <button
              className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-background-dark px-2 text-slate-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.02 1.024-2.6 2.112-5.912 2.112-5.344 0-9.624-4.32-9.624-9.624s4.28-9.624 9.624-9.624c2.88 0 5.144 1.136 6.696 2.608l2.312-2.312C19.124 1.256 16.148 0 12.48 0 5.864 0 0 5.864 0 12.48s5.864 12.48 12.48 12.48c3.592 0 6.28-1.176 8.352-3.352 2.136-2.136 2.808-5.144 2.808-7.584 0-.72-.064-1.408-.184-2.112h-11.008z"></path>
              </svg>
              Google
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
          New to Vetro?{" "}
          <Link className="font-bold text-primary hover:text-primary/80" href="/signup">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
