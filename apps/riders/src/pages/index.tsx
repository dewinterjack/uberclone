import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const UserCard: React.FC<{
  user: NonNullable<inferProcedureOutput<AppRouter["user"]["get"]>>;
}> = ({ user }) => {
  return (
    <div className="max-w-2xl rounded-lg border-2 border-gray-500 p-4 transition-all hover:scale-[101%]">
      <h2 className="text-2xl font-bold text-[hsl(280,100%,70%)]">
        {user.firstName} {user.lastName}
      </h2>
      <p>{user.email}</p>
    </div>
  );
};

const Home: NextPage = () => {
  const userQuery = trpc.user.get.useQuery();

  return (
    <>
      <Head>
        <title>Uber Clone - Riders App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Uber Clone - Riders App
          </h1>
          <AuthShowcase />

          <div className="flex h-[40vh] justify-center overflow-y-scroll px-4 text-2xl">
            {userQuery.data ? (
              <div className="flex flex-col gap-4">
                <UserCard user={userQuery.data} />
              </div>
            ) : (
              <p>Loading..</p>
            )}
          </div>
        </div>
        <footer className="mt-auto w-full p-4 text-center">
          <Link
            href={`${process.env.NEXT_PUBLIC_LANDING_APP_URL}`}
            className="text-white hover:underline"
          >
            Go to Landing Page
          </Link>
        </footer>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    { enabled: !!isSignedIn },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="text-center text-2xl text-white">
            {secretMessage && (
              <span>
                {" "}
                {secretMessage} click the user button!
                <br />
              </span>
            )}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-center text-2xl text-white">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};
