import { FC } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Signin from "@/components/SignIn";
import { ChevronLeft } from "lucide-react";

const page: FC = ({}) => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col justify-center items-center gap-2">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20"
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Home
        </Link>
        <Signin />
      </div>
    </div>
  );
};

export default page;
