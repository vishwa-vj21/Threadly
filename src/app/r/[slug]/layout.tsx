// import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
// import ToFeedButton from '@/components/ToFeedButton'
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Threadly",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subreddit) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });
  const postCount = subreddit.posts.length;

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          {/* info sidebar */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white h-fit order-first md:order-last shadow-sm">
            <div className="px-6 py-6 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {subreddit.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="font-semibold text-lg">r/{subreddit.name}</h2>

                  <p className="text-sm text-gray-500">Community discussion</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 space-y-5">
              {/* Add later if you implement descriptions */}
              {/* <p className="text-sm text-gray-600">
      {subreddit.description}
    </p> */}

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-gray-50 py-3">
                  <p className="text-xl font-bold">{memberCount}</p>
                  <p className="text-xs text-gray-500 uppercase">Members</p>
                </div>

                <div className="rounded-lg bg-gray-50 py-3">
                  <p className="text-xl font-bold">{postCount}</p>
                  <p className="text-xs text-gray-500 uppercase">Posts</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Created</span>

                  <span className="font-medium">
                    {format(subreddit.createdAt, "MMM d, yyyy")}
                  </span>
                </div>

                {subreddit.creatorId === session?.user?.id && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-500">Role</span>

                    <span className="font-medium text-emerald-600">
                      👑 Creator
                    </span>
                  </div>
                )}
              </div>

              {subreddit.creatorId !== session?.user?.id && (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              )}

              <Link
                href={`/r/${slug}/submit`}
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
