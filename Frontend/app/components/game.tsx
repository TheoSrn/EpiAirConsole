"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './games.css';
import PlayPage from './play';

type Game = {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  releaseDate?: string;
  tags?: string[];
  publisher?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function GamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games`);
        if (res.ok) {
          const data = await res.json();
          setGames(data);
        } else {
          setError('Erreur lors du chargement des jeux');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  // Normaliser l'URL de l'image
  const normalizeImageUrl = (imageUrl?: string): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return '';
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/games/${imageUrl}`;
  };

  // Récupérer tous les tags uniques
  const allTags = Array.from(
    new Set(games.flatMap(game => game.tags || []))
  ).filter(Boolean);

  // Filtrer les jeux
  const filteredGames = games.filter(game => {
    const matchesSearch = !searchTerm ||
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag ||
      (game.tags && game.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="games-container">
        <div className="games-loading">
          <div className="spinner"></div>
          <p>Chargement des jeux...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="games-container">
        <div className="games-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  if (isPlaying) {
    return <PlayPage />;
  }

  return (
    <div className="games-container">
      <div className="games-header">
        <h1 className="games-title">Bibliothèque de Jeux</h1>
        <p className="games-subtitle">Découvrez tous nos jeux disponibles</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="games-filters">
        <div className="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un jeu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {allTags.length > 0 && (
          <div className="tags-filter">
            <button
              className={`tag-button ${selectedTag === null ? 'active' : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              Tous
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Compteur de résultats */}
      <div className="games-count">
        {filteredGames.length} {filteredGames.length === 1 ? 'jeu trouvé' : 'jeux trouvés'}
      </div>

      {/* Grille de jeux */}
      {filteredGames.length === 0 ? (
        <div className="games-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>Aucun jeu trouvé</p>
        </div>
      ) : (
        <div className="games-grid">
          {filteredGames.map((game) => {
            const imageUrl = normalizeImageUrl(game.imageUrl);
            return (
              <div key={game._id} className="game-card" onClick={() => setSelectedGame(game)}>
                {imageUrl ? (
                  <div className="game-image-wrapper">
                    <img
                      src={imageUrl}
                      alt={game.name}
                      className="game-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="game-image-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                )}
                <div className="game-content">
                  <h3 className="game-name">{game.name}</h3>
                  {game.description && (
                    <p className="game-description">
                      {game.description.length > 150
                        ? `${game.description.substring(0, 150)}...`
                        : game.description}
                    </p>
                  )}

                  <div className="game-info">
                    {game.publisher && (
                      <div className="game-info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>{game.publisher}</span>
                      </div>
                    )}

                    {game.releaseDate && (
                      <div className="game-info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{formatDate(game.releaseDate)}</span>
                      </div>
                    )}
                  </div>

                  {game.tags && game.tags.length > 0 && (
                    <div className="game-tags">
                      {game.tags.map((tag, index) => (
                        <span key={index} className="game-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedGame && (
        <div className="game-modal-overlay" onClick={() => setSelectedGame(null)}>
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="game-modal-close"
              onClick={() => setSelectedGame(null)}
            >
              ✕
            </button>

            <div className="game-modal-header">
              <h2>{selectedGame.name}</h2>
              {selectedGame.publisher && (
                <span className="game-modal-publisher">
                  {selectedGame.publisher}
                </span>
              )}
            </div>

            {selectedGame.imageUrl && (
              <img
                src={normalizeImageUrl(selectedGame.imageUrl)}
                alt={selectedGame.name}
                className="game-modal-image"
              />
            )}

            {selectedGame.description && (
              <p className="game-modal-description">
                {selectedGame.description}
              </p>
            )}

            <div className="game-modal-meta">
              {selectedGame.releaseDate && (
                <span>{formatDate(selectedGame.releaseDate)}</span>
              )}
            </div>

            {selectedGame.tags && (
              <div className="game-modal-tags">
                {selectedGame.tags.map((tag, i) => (
                  <span key={i} className="game-tag">{tag}</span>
                ))}
              </div>
            )}

            <button
              className="game-launch-button"
              onClick={() => {
                // TODO: logique pour lancer le jeu
                setIsPlaying(true);
                console.log("Lancer le jeu :", selectedGame._id);
              }}
            >
              ▶ Lancer le jeu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
