import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

const Signin = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex justify-center">
          <Icons.logo className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Threadly account and agree to our
          user Agreement and Privacy Policy
        </p>

        {/* sign-in component   */}
        <UserAuthForm />

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
