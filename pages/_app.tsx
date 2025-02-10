import '@App/styles/globals.css';
import initMSW from '@App/service-workers/msw';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { MainHeader } from '@Features/main-header/ui/MainHeader';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initMSW();
  }, []);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen h-max">
        <main className="grow">
          <MainHeader />
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
