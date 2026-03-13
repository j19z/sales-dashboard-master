import Link from "next/link";
import { signup } from "../actions";
import PasswordField from "@/components/auth/PasswordField";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-[440px] bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-primary/10 overflow-hidden">
      <div className="p-8 pb-4 text-center">
        <div className="inline-flex items-center justify-center size-12 bg-primary/10 rounded-lg mb-6 text-primary">
          <span className="material-symbols-outlined text-3xl">insights</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create your account</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">Join Vetro sales AI today</p>
        {message && (
          <div className="mt-4 rounded-lg px-4 py-3 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-left">
            {message}
          </div>
        )}
      </div>
      <form action={signup} className="px-8 py-6 space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              person
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Enter your full name"
              type="text"
              name="fullName"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              mail
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="you@company.com"
              type="email"
              name="email"
              required
            />
          </div>
        </div>
        <PasswordField 
          label="Password" 
          name="password"
          id="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          className="flex flex-col gap-2"
        />

        <div className="pt-2">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group cursor-pointer">
            Create Account
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
        <div className="relative py-2 flex items-center">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          <span className="mx-4 text-slate-400 text-xs uppercase tracking-widest font-medium">Security</span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
        </div>
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <span className="material-symbols-outlined text-primary text-lg">shield</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            By signing up, you agree to our <Link className="text-primary hover:underline font-medium" href="#">Terms of Service</Link> and <Link className="text-primary hover:underline font-medium" href="#">Privacy Policy</Link>. Data is encrypted and stored securely.
          </p>
        </div>
      </form>
      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-t border-slate-100 dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Already have an account?
          <Link className="text-primary font-bold hover:underline ml-1" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
