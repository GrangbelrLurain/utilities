import "@/styles/globals.css";
import initMSW from "@/utils/serviceWorkers/msw";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { MdMenu } from "react-icons/md";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initMSW();
  }, []);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen h-max">
        <header className="fixed left-0 top-0 w-full py-2">
          <div className="max-w-5xl mx-auto">
            <label className="btn btn-sm btn-square" htmlFor="my-drawer">
              <MdMenu size="20px" />
            </label>
          </div>
        </header>
        <main className="grow">
          <Component {...pageProps} />
        </main>
        <footer className="footer shrink-0" />
      </div>
      <nav className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu">
          <li />
        </ul>
      </nav>
    </div>
  );
}
