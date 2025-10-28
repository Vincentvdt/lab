import Link from "next/link";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <ul>
          <li></li>
          <li>
            <Link className="hover:underline" href="/menu-hover">
              Menu Hover
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
