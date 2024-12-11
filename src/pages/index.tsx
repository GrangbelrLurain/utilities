import Link from 'next/link';
export default function Home() {
  return (
    <section className="flex flex-col pt-20">
      <article className="flex flex-col gap-4 mx-auto max-w-screen-xl w-full">
        <Link href="/json/compare" className="link-hover">
          json 비교하기
        </Link>
        <Link href="/json/search-case" className="link-hover">
          json key case 검사하기
        </Link>
      </article>
    </section>
  );
}
