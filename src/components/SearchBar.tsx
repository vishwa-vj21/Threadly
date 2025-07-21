"use client";
import { FC, useCallback, useState } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { CommandEmpty } from "cmdk";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { debounce } from "lodash";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const request = debounce(() => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/subreddit/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search-communities", input],
    enabled: false,
  });

  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />
      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md z-50">
          {isFetched && (
            <CommandEmpty>
              <div className="px-4 py-6 text-center text-sm text-zinc-500 flex flex-col items-center justify-center">
                <Users className="h-5 w-5 mb-2 text-zinc-400" />
                <p>No communities found</p>
              </div>
            </CommandEmpty>
          )}

          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subreddit) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className="mr-2 h-4 w-4 text-zinc-600" />
                  <a
                    href={`/r/${subreddit.name}`}
                    className="text-zinc-800 hover:underline"
                  >
                    r/{subreddit.name}
                  </a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
