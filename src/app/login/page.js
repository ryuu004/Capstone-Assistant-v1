"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        setError('Invalid email or password');
      } else {
        router.push('/chat');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background-dark)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[var(--background-light)] rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[var(--text-primary)]">
          Welcome Back
        </h1>
        <p className="text-center text-[var(--text-secondary)]">Sign in to continue to your AI Assistant</p>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-[var(--text-secondary)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-[var(--text-primary)] bg-[var(--background-dark)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--text-secondary)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-[var(--text-primary)] bg-[var(--background-dark)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 font-semibold text-white bg-[var(--primary-blue)] rounded-md hover:bg-[var(--primary-blue-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-light)] focus:ring-[var(--primary-blue)]"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-[var(--text-secondary)]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-[var(--primary-blue)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}