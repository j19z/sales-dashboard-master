'use client';

import React, { useState } from 'react';

interface PasswordFieldProps {
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  label?: string;
  className?: string;
}

export default function PasswordField({
  name = 'password',
  id = 'password',
  placeholder = '••••••••',
  required = true,
  autoComplete = 'current-password',
  label = 'Password',
  className = '',
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="mt-1 relative">
        <input
          autoComplete={autoComplete}
          className="block w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm text-slate-900 dark:text-white transition-all"
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          type={showPassword ? 'text' : 'password'}
          suppressHydrationWarning
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer focus:outline-none"
          onClick={togglePasswordVisibility}
          type="button"
          tabIndex={-1}
        >
          <span className="material-symbols-outlined select-none">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  );
}
