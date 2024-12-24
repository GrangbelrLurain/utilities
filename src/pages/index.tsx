import Link from 'next/link';
export default function Home() {
  return (
    <section className="flex flex-col pt-20 gap-4">
      <h1 className="mx-auto max-w-screen-xl text-2xl font-bold w-full text-primary border-b border-primary pb-4">
        Utilities
      </h1>
      <h2 className="mx-auto max-w-screen-xl text-xl font-bold w-full">JSON</h2>
      <article className="mx-auto max-w-screen-xl w-full">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/json/compare" className="link-hover">
              json compare
            </Link>
          </li>
          <li>
            <Link href="/json/search-case" className="link-hover">
              json key naming convention
            </Link>
          </li>
        </ul>
      </article>
      <h2 className="mx-auto max-w-screen-xl text-xl font-bold w-full">URL</h2>
      <article className="mx-auto max-w-screen-xl w-full">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/url/format-json" className="link-hover">
              url to json
            </Link>
          </li>
        </ul>
      </article>
      <h2 className="mx-auto max-w-screen-xl text-xl font-bold w-full">Translation</h2>
      <article className="mx-auto max-w-screen-xl w-full">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/translation/encode" className="link-hover">
              encode
            </Link>
          </li>
          <li>
            <Link href="/translation/decode" className="link-hover">
              decode
            </Link>
          </li>
        </ul>
      </article>
    </section>
  );
}
