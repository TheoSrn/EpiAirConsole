"use client";

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../auth/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/profile');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err) || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="card-header">
          <h1 className="login-title">Connexion</h1>
          <p className="login-subtitle">Connecte-toi pour accéder à ton profil</p>
        </div>

        <form onSubmit={handleSubmit} className="form-space" aria-describedby={error ? 'login-error' : undefined}>
          <div>
            <label htmlFor="email" className="input-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <div className="input-with-icon">
            <label htmlFor="password" className="input-label">Mot de passe</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="input"
            />
            <button
              type="button"
              className="toggle-visibility"
              aria-pressed={showPassword}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.67 21.67 0 0 1 5-5"/><path d="M1 1l22 22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          {error && (
            <div id="login-error" className="error">
              {error}
            </div>
          )}

          <div className="controls">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox" />
              Se souvenir de moi
            </label>
            <a className="forgot-link" href="#">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            className="submit"
            disabled={loading}
          >
            {loading ? <svg className="spinner" viewBox="0 0 24 24" aria-hidden="true"><circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path className="spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> : null}
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="note">Pas encore de compte ? <Link href="/auth/register" className="text-sky-500 hover:underline">S'inscrire</Link></p>
        </form>
      </div>
    </div>
  );
}
