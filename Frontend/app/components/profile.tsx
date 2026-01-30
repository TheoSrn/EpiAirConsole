"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../profile/profile.css';

type User = {
  _id?: string;
  email?: string;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
  gamesData?: any[];
  [key: string]: any;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (token && u) {
      const userData = JSON.parse(u) as User;
      setUser(userData);
      setFormData({ username: userData.username || '', email: userData.email || '' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ username: user?.username || '', email: user?.email || '' });
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token || !user?._id) {
        throw new Error('Non authentifié');
      }

      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour');

      // Mettre à jour l'utilisateur dans le state et localStorage
      const updatedUser = { ...user, ...formData, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Profil</h1>
          <p className="profile-message">Vous n'êtes pas connecté.</p>
          <button onClick={() => router.push('/auth')} className="btn-primary">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1 className="profile-title">Mon Profil</h1>
          {!isEditing && (
            <button onClick={handleEdit} className="btn-edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Modifier
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {success}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="votre@email.com"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="btn-secondary" disabled={loading}>
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                      <path className="spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-section">
              <div className="info-item">
                <span className="info-label">Nom d'utilisateur</span>
                <span className="info-value">{user.username || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Membre depuis</span>
                <span className="info-value">{formatDate(user.createdAt)}</span>
              </div>
              {user.gamesData && user.gamesData.length > 0 && (
                <div className="info-item">
                  <span className="info-label">Jeux joués</span>
                  <span className="info-value">{user.gamesData.length}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="profile-footer">
          <button onClick={handleLogout} className="btn-logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
