import Link from "next/link";
import { resetPassword } from "../actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-primary/10">
      <div className="pt-10 pb-6 flex flex-col items-center">
        <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight tracking-tight">Password Recovery</h2>
      </div>
      <div className="px-8 pb-10">
        {message && (
          <div className="mb-6 rounded-lg px-4 py-3 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
            {message}
          </div>
        )}
        <p className="text-slate-600 dark:text-slate-400 text-center text-base font-normal leading-relaxed mb-8">
          Forgot your password? Enter your email address below and we&apos;ll send you a link to reset it.
        </p>
        <form action={resetPassword} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
              <input
                className="block w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 pl-12 pr-4 text-base font-normal placeholder:text-slate-400 transition-all"
                placeholder="you@company.com"
                required
                type="email"
                name="email"
              />
            </div>
          </div>
          <button
            className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-lg shadow-primary/20"
            type="submit"
          >
            <span>Send Reset Link</span>
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline" href="/login">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
