"use client";

import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { startTransition } from "react";

interface DeleteCommunityProps {
  subredditId: string;
  subredditName: string;
}

const DeleteCommunityButton = ({
  subredditId,
  subredditName,
}: DeleteCommunityProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: deleteCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload = { subredditId };
      const { data } = await axios.post("/api/subreddit/delete", payload);
      return data;
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Error deleting community",
        description: "Something went wrong. Can't delete the community.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      startTransition(() => {
        router.push("/"); // Redirect to home after deletion
        router.refresh();
      });
      toast({
        title: "Community Deleted",
        description: `r/${subredditName} has been deleted.`,
      });
    },
  });

  return (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isLoading}
      onClick={() => deleteCommunity()}
    >
      Delete Community
    </Button>
  );
};

export default DeleteCommunityButton;
