import Link from "next/link";
import { Icons } from "./Icons";

const Signin = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto w-6 h-6"> </Icons.logo>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a breadit account and agree to our
          user Agreement and Privacy Policy
        </p>

        {/* sign-in component   */}

        <p className="text-sm text-center text-zinc-700 px-8">
          New to Breaddit?{" "}
          <Link
            href="/sign-up"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
