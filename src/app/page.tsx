import { count } from "drizzle-orm";
import { SignInButton, SorryButton } from "~/components/home";
import { Badge } from "~/components/ui/badge";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { sorry } from "~/server/db/schema";

const Home = async () => {
  const session = await getServerAuthSession();
  const numSorrys = (
    await db.select({ count: count() }).from(sorry).execute()
  )[0]!.count;

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <div className="flex space-x-2">
        <div className="my-auto">Sorrys</div> <Badge>{numSorrys}</Badge>
      </div>
      {session ? <SorryButton /> : <SignInButton />}
    </div>
  );
};

export default Home;
