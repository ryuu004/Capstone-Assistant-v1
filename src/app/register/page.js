"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background-dark)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[var(--background-light)] rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[var(--text-primary)]">
          Create an Account
        </h1>
        <p className="text-center text-[var(--text-secondary)]">Get started with your AI Assistant</p>
        
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
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[var(--primary-blue)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}