import { Subreddit, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
