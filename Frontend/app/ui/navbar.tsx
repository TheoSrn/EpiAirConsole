"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './NavBar.module.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const checkToken = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      setIsLogged(!!token);
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, [pathname]);

  function handleProtectedNav(loggedInPath: string, fallbackPath: string, e?: MouseEvent<HTMLAnchorElement>) {
    e?.preventDefault?.();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    router.push(token ? loggedInPath : fallbackPath);
    setOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" aria-label="EpiAirConsole home">
            <img src="/EpiAirCOnsoleLogo.png" alt="EpiAirConsole" className={styles.logoImage} />
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            <li>
              <Link href="/game" className={`${styles.navLink} ${styles.btn} ${pathname === '/game' ? styles.btnActive : ''}`} onClick={(e) => handleProtectedNav('/game', '/', e)}>
                Games
              </Link>
            </li>
            <li>
              <Link href="/profile" className={`${styles.navLink} ${styles.btn} ${pathname === '/profile' ? styles.btnActive : ''}`} onClick={(e) => handleProtectedNav('/profile', '/auth', e)}>
                {mounted && (isLogged ? 'Profile' : 'Connection')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* <button
          className={`${styles.burger} ${open ? styles.open : ''}`}
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
        >
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </button> */}
      </div>

      {/* <div className={`${styles.mobileMenu} ${open ? 'open' : ''}`}>
        <ul>
          <li>
            <Link href="/carroussel" className={`${styles.mobileLink} ${styles.btn} ${pathname === '/carroussel' ? styles.btnActive : ''}`} onClick={(e) => handleProtectedNav('/carroussel', '/', e)}>
              Carroussel
            </Link>
          </li>
          <li>
            <Link href="/profile" className={`${styles.mobileLink} ${styles.btn} ${pathname === '/profile' ? styles.btnActive : ''}`} onClick={(e) => handleProtectedNav('/profile', '/auth', e)}>
              {isLogged ? 'Profile' : 'Connection'}
            </Link>
          </li>
        </ul>
      </div> */}
    </header>
  );
}