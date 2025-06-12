import { buttonVariants } from "@/components/ui/Button";
import { FC } from "react";
import Link from "next/link";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <Link
        className={buttonVariants({
          className: "px-4 py-8",
        })}
        href="/"
      >
        Create a community
      </Link>
    </div>
  );
};

export default page;
