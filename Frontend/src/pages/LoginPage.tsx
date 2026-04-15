import { useState } from 'react';
import type { FormEvent } from 'react';
import { brandAssets } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

interface LoginForm {
  email: string;
  password: string;
}

const defaultForm: LoginForm = {
  email: 'admin@admin.com',
  password: 'admin123',
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [form, setForm] = useState<LoginForm>(defaultForm);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const nextErrors: Partial<LoginForm> = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    const isValidUser = form.email.trim().toLowerCase() === 'admin@admin.com' && form.password === 'admin123';

    if (!isValidUser) {
      setSubmitError('Invalid credentials. Use admin@admin.com / admin123');
      return;
    }

    onLoginSuccess();
  };

  return (
    <div className="mx-auto my-[4vh] grid min-h-[92vh] w-[min(96vw,1200px)] grid-cols-1 overflow-hidden border border-neutral-500 bg-white lg:grid-cols-[45%_55%]">
      <div className="hidden overflow-hidden lg:block">
        <img src={brandAssets.loginBg} alt="Restaurant interior" className="h-full w-full object-cover" />
      </div>

      <div className="grid place-items-center bg-neutral-100 p-5">
        <form
          className="w-full max-w-[360px] rounded-md bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
          onSubmit={handleSubmit}
          noValidate
        >
          <img src={brandAssets.logo} alt="Restaurant Management System" className="mx-auto mb-2 h-auto w-[74px]" />
          <h1 className="m-0 text-center text-xs font-medium text-neutral-700">Restaurant Management System</h1>
          <p className="mb-4 mt-1 text-center text-base font-semibold text-neutral-900">Admin Panel</p>

          <label htmlFor="email" className="mb-1 block text-[11px] text-neutral-500">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className={`h-8 w-full rounded border px-2.5 text-xs text-neutral-700 outline-none focus:ring-2 focus:ring-brand-100 ${
              errors.email ? 'border-rose-400' : 'border-neutral-300'
            }`}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="mt-1 text-[11px] text-rose-500">{errors.email}</p>}

          <label htmlFor="password" className="mb-1 mt-3 block text-[11px] text-neutral-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className={`h-8 w-full rounded border px-2.5 text-xs text-neutral-700 outline-none focus:ring-2 focus:ring-brand-100 ${
              errors.password ? 'border-rose-400' : 'border-neutral-300'
            }`}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && <p className="mt-1 text-[11px] text-rose-500">{errors.password}</p>}

          {submitError && <p className="mt-3 rounded border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-600">{submitError}</p>}

          <button
            type="submit"
            className="mt-4 h-9 w-full rounded bg-gradient-to-r from-[#c3a06f] to-[#7f5a27] text-xs font-semibold text-white transition hover:brightness-105"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

