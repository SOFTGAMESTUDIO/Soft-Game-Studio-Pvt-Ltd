import React, { useState } from "react";
import { Input } from "../../UiComponents/input";
import { Label } from "../../UiComponents/label";
import { cn } from "../../Library/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import {
  handleLogin,
  handleGithubLogin,
  handleGoogleLogin,
} from "../../Modules/LoginHamdler";
import { useNavigate, Link } from "react-router-dom"; // React router

 function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email, password, navigate);
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-neutral-950">
      <div className="shadow-input w-full max-w-md rounded-2xl border-white border-2 p-4 md:p-8 bg-black">
        <h2 className="text-xl font-bold text-neutral-200">
          Welcome to Soft Game Studio
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-300">
          Secure access to your creative journey with Soft Game Studio.
        </p>
        <form className="my-8" onSubmit={onSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="user123@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link
              to="/ResetPassword"
              className="text-red-500 hover:underline text-sm text-right"
            >
              Forgot Password?
            </Link>
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md px-4 font-medium text-black bg-zinc-900 shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => handleGithubLogin(navigate)}
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-300" />
              <span className="text-sm text-neutral-300">GitHub</span>
              <BottomGradient />
            </button>
            <button
              className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md px-4 font-medium text-black bg-zinc-900 shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => handleGoogleLogin(navigate)}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
              <span className="text-sm text-neutral-300">Google</span>
              <BottomGradient />
            </button>
          </div>
        </form>

        <p className="text-center text-gray-200 text-sm mt-4">
          Don’t have an account?
          <Link
            to="/signup"
            className="text-red-500 hover:underline font-medium ml-2"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

export default UserLogin;
