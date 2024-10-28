import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex min-h-[calc(100vh-3rem)] flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Uber Clone - Landing Page
          </h1>
        </div>
      </main>
      <footer className="w-full bg-[#15162c] p-4 text-center">
        <Link
          href={`${process.env.NEXT_PUBLIC_RIDERS_APP_URL}`}
          className="text-white hover:underline"
        >
          Go to Riders Page
        </Link>
      </footer>
    </>
  );
}
