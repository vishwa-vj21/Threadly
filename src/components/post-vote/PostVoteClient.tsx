"use client";

import { VoteType } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { PostVoteRequest } from "@/lib/validators/vote";
import { toast } from "@/hooks/use-toast";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };
      await axios.patch("/api/subreddit/post/vote", payload);
    },
    onMutate: (type: VoteType) => {
      // Optimistically update vote
      if (currentVote === type) {
        // User is removing their vote
        setCurrentVote(undefined);
        setVotesAmt((prev) => (type === "UP" ? prev - 1 : prev + 1));
      } else {
        // User is switching or voting for first time
        setCurrentVote(type);
        setVotesAmt((prev) => {
          if (currentVote === undefined) {
            // First time vote
            return type === "UP" ? prev + 1 : prev - 1;
          } else {
            // Switching vote
            return type === "UP" ? prev + 2 : prev - 2;
          }
        });
      }
    },
    onError: (err, voteType) => {
      // Rollback optimistic update
      setVotesAmt(initialVotesAmt);
      setCurrentVote(prevVote);

      if (err instanceof AxiosError && err.response?.status === 401) {
        return loginToast();
      }
      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again later.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      {/* upvote */}
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>

      {/* score */}
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        className={cn({
          "text-emerald-500": currentVote === "DOWN",
        })}
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
