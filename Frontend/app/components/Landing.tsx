"use client";

import Link from 'next/link';
import styles from './Landing.module.css';
import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { buildApiUrl, resolveImageUrl } from '../utils/api';

type Game = {
  _id: string;
  name: string;
  imageUrl: string;
  description?: string;
  [key: string]: any;
};

export default function Landing() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(buildApiUrl('/api/games'));
        if (res.ok) {
          const data = await res.json();
          console.log('Raw games data:', data);
          const gamesWithImages = data.filter((game: Game) => {
            const hasImage = game.imageUrl && game.imageUrl.trim() !== '';
            if (!hasImage) {
              console.log('Game without image:', game.name, game.imageUrl);
            }
            return hasImage;
          });
          console.log('Games with images loaded:', gamesWithImages.length, gamesWithImages);
          setGames(gamesWithImages);
        } else {
          const errorText = await res.text();
          console.error('Failed to fetch games:', res.status, errorText);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoadingGames(false);
      }
    }
    fetchGames();
  }, []);

  function handleConnection(e?: MouseEvent<HTMLAnchorElement>) {
    e?.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.push('/game');
    } else {
      router.push('/auth');
    }
  }

  function handleGetStarted(e?: MouseEvent<HTMLAnchorElement>) {
    e?.preventDefault();
    router.push('/auth/register');
  }

  return (
    <main className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Nouvelle génération de gaming
          </div>
          <h1 className={styles.title}>
            <span className={styles.titleGradient}>EpiAirConsole</span>
          </h1>
          <p className={styles.subtitle}>
            Jouez depuis chez vous, seulement avec votre smartphone.
            <br />
            Accédez à une bibliothèque de jeux instantanément, sans installation.
          </p>
          <div className={styles.ctaGroup}>
            {isLoggedIn ? (
              <Link href="/game" className={styles.ctaPrimary} onClick={handleConnection}>
                <span>Accéder aux jeux</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ) : (
              <>
                <Link href="/auth/register" className={styles.ctaPrimary} onClick={handleGetStarted}>
                  <span>Commencer gratuitement</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link href="/auth" className={styles.ctaSecondary} onClick={handleConnection}>
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.glow}></div>
          <div className={styles.gridPattern}></div>
        </div>
      </section>

      {/* Games Carousel Section */}
      {games.length > 0 && (
        <section className={styles.gamesCarousel}>
          <div className={styles.carouselContainer}>
            <h2 className={styles.carouselTitle}>Découvrez nos jeux</h2>
            <div className={styles.carouselWrapper}>
              <div className={styles.carouselTrack}>
                {[...games, ...games, ...games].map((game, index) => {
                  let imageUrl = game.imageUrl || '';
                  const originalUrl = imageUrl;
                  if (!imageUrl || imageUrl.trim() === '') {
                    return null;
                  }
                  imageUrl = resolveImageUrl(imageUrl);
                  if (index === 0) {
                    console.log('First game image debug:', {
                      original: originalUrl,
                      normalized: imageUrl,
                      game: game.name,
                      fullGame: game
                    });
                  }
                  return (
                    <div
                      key={`${game._id}-${index}`}
                      className={styles.carouselItem}
                    >
                      <img
                        src={imageUrl}
                        alt={game.name || 'Game'}
                        className={styles.carouselImage}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.error('Image failed to load:', {
                            normalizedUrl: imageUrl,
                            originalUrl: originalUrl,
                            game: game.name,
                            gameId: game._id,
                            suggestion: `Try opening this URL directly in your browser: ${imageUrl}`
                          });
                          const parent = target.parentElement;
                          if (parent) {
                            parent.style.opacity = '0.3';
                            parent.style.pointerEvents = 'none';
                          }
                        }}
                        onLoad={() => {
                          if (index === 0) {
                            console.log('Image loaded successfully:', imageUrl);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>Pourquoi choisir EpiAirConsole ?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Instantané</h3>
              <p className={styles.featureDescription}>
                Aucune installation requise. Lancez vos jeux en un clic depuis votre navigateur.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Bibliothèque variée</h3>
              <p className={styles.featureDescription}>
                Découvrez une sélection de jeux soigneusement choisis pour tous les goûts.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Communauté</h3>
              <p className={styles.featureDescription}>
                Partagez vos expériences et découvrez les jeux préférés de la communauté.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Sécurisé</h3>
              <p className={styles.featureDescription}>
                Vos données sont protégées avec les dernières technologies de sécurité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaContent}>
          <h2 className={styles.finalCtaTitle}>Prêt à commencer ?</h2>
          <p className={styles.finalCtaSubtitle}>
            Rejoignez EpiAirConsole aujourd'hui et découvrez une nouvelle façon de jouer.
          </p>
          {!isLoggedIn && (
            <Link href="/auth/register" className={styles.ctaPrimary} onClick={handleGetStarted}>
              <span>Créer un compte gratuit</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
