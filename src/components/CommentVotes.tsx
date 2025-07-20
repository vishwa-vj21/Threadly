"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "./ui/Button";

type PartialVote = Pick<CommentVote, "type"> | undefined;
interface PostVoteClientProps {
  commentId: string;
  initialVotesAmt: number;
  initialVote?: PartialVote;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  commentId,
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
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };
      await axios.patch("/api/subreddit/post/comment/vote", payload);
    },
    onMutate: (type) => {
      // Optimistically update vote
      if (currentVote?.type === type) {
        // User is removing their vote
        setCurrentVote(undefined);
        setVotesAmt((prev) => (type === "UP" ? prev - 1 : prev + 1));
      } else {
        // User is switching or voting for first time
        setCurrentVote({ type });
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
    <div className="flex gap-1">
      {/* upvote */}
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
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
          "text-emerald-500": currentVote?.type === "DOWN",
        })}
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
