import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { GeneralFeed } from "@/components/GeneralFeed";
import CustomFeed from "@/components/CustomFeed";
console.log("CustomFeed:", CustomFeed);

export const dynamic = "force-dynamic";
export default async function Home() {
  const session = await getAuthSession();
  return (
    <div>
      <h1 className="font-bold text-3xl md:text=4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md: gap-x-4 md:gap-x-4 py-6 items-start">
        {/*@ts-expect-error server component */}
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* subreddit info */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm order-first md:order-last">
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-700 via-black to-zinc-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-zinc-800 p-2">
                <HomeIcon className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Home</h2>
                <p className="text-sm text-zinc-400">Welcome to Threadly</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <p className="text-sm leading-6 text-zinc-600">
              Discover communities, join meaningful discussions, and share ideas
              with people who have similar interests. Your next great
              conversation starts here.
            </p>

            {/* Info Card */}
            <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">
                Community Guidelines
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>Be respectful and welcoming.</li>
                <li>Share quality content and discussions.</li>
                <li>Follow each community&apos;s rules.</li>
              </ul>
            </div>

            {/* Quote */}
            <div className="mt-5 rounded-lg border-l-4 border-zinc-900 bg-zinc-100 p-4">
              <p className="text-sm italic text-zinc-700">
                Great communities are built through thoughtful conversations.
              </p>
            </div>

            {/* Button */}
            <Link
              href="/r/create"
              className={buttonVariants({
                className:
                  "w-full mt-6 bg-gradient-to-r from-zinc-700 via-black to-zinc-600 hover:bg-zinc-800 text-white",
              })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
