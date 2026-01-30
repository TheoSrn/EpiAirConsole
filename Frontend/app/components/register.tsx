"use client";

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import '../auth/login.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/profile');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err) || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="card-header">
          <h1 className="login-title">Inscription</h1>
          <p className="login-subtitle">Crée ton compte pour commencer</p>
        </div>

        <form onSubmit={handleSubmit} className="form-space" aria-describedby={error ? 'register-error' : undefined}>
          <div>
            <label htmlFor="name" className="input-label">Nom</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="input"
            />
          </div>

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

          <div className="input-with-icon">
            <label htmlFor="confirm" className="input-label">Confirmer le mot de passe</label>
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
              className="input"
            />
            <button
              type="button"
              className="toggle-visibility"
              aria-pressed={showConfirm}
              aria-label={showConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              onClick={() => setShowConfirm((s) => !s)}
            >
              {showConfirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.67 21.67 0 0 1 5-5"/><path d="M1 1l22 22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          {error && (
            <div id="register-error" className="error">
              {error}
            </div>
          )}

          <div className="controls">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox" />
              J'accepte les conditions
            </label>
            <a className="forgot-link" href="#">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            className="submit"
            disabled={loading}
          >
            {loading ? <svg className="spinner" viewBox="0 0 24 24" aria-hidden="true"><circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path className="spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> : null}
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>

          <p className="note">Déjà un compte ? <a href="/auth" className="text-sky-500 hover:underline">Se connecter</a></p>
        </form>
      </div>
    </div>
  );
}
