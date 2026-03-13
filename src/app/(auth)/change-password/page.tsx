import Link from "next/link";
import { updatePassword } from "../actions";
import PasswordField from "@/components/auth/PasswordField";

export default async function ChangePasswordPage({
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
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Set New Password</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Please enter your new password below.
      </p>

      {message && (
        <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
          {message}
        </div>
      )}

      <div className="mt-10">
        <form action={updatePassword} className="space-y-6">
          <PasswordField 
            label="New Password" 
            name="password"
            id="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
          />
          
          <div>
            <button
              className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer"
              type="submit"
            >
              Update Password
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
          Back to{" "}
          <Link className="font-bold text-primary hover:text-primary/80" href="/login">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
