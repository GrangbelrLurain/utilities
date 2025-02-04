import '@/styles/globals.css';
import initMSW from '@/utils/serviceWorkers/msw';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initMSW();
  }, []);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen h-max">
        <main className="grow">
          <header className="mx-auto max-w-screen-xl w-full flex justify-end py-2">
            <Link href="https://github.com/GrangbelrLurain/utilities">
              <FaGithub size={24} />
            </Link>
          </header>
          <Component {...pageProps} />
        </main>
        <footer className="footer shrink-0" />
      </div>
      <nav className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay" />
        <ul className="menu">
          <li />
        </ul>
      </nav>
    </div>
  );
}
