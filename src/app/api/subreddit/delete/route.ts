import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Define the expected request body shape
const DeleteCommunityValidator = z.object({
  subredditId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = DeleteCommunityValidator.parse(body);

    // Fetch the subreddit
    const subreddit = await db.subreddit.findUnique({
      where: { id: subredditId },
    });

    if (!subreddit) {
      return new Response("Subreddit not found.", { status: 404 });
    }

    // Check if the user is the creator
    if (subreddit.creatorId !== session.user.id) {
      return new Response("You are not authorized to delete this community.", {
        status: 403,
      });
    }

    // Delete related posts first (if you don't have cascading set up)
    await db.post.deleteMany({
      where: { subredditId },
    });

    // Delete subscriptions
    await db.subscription.deleteMany({
      where: { subredditId },
    });

    // Finally, delete the subreddit
    await db.subreddit.delete({
      where: { id: subredditId },
    });

    return new Response("Community deleted successfully.", { status: 200 });
  } catch (error) {
    console.error("Delete subreddit error:", error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not delete community. Please try again later.", {
      status: 500,
    });
  }
}
