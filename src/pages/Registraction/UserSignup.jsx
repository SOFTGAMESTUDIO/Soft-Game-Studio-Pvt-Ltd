import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

import {
  auth,
  providerGoogle,
  providerGithub,
} from "../../DataBase/firebaseConfig";
import { addUserToFirestore } from "../../Modules/signupHandler";
import { Input } from "../../UiComponents/input";
import { Label } from "../../UiComponents/label";
import { cn } from "../../Library/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export default function UserSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await addUserToFirestore(userCredential.user, formData);
      navigate("/Login");
    } catch (error) {
      console.error("Email signup failed:", error.message);
    }
  };

  const handleSocialSignup = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const nameParts = result.user.displayName?.split(" ") || ["", ""];
      const socialData = {
        firstName: nameParts[0],
        lastName: nameParts[1],
        email: result.user.email,
        phone: "",
      };
      await addUserToFirestore(result.user, socialData);
      navigate("/login");
    } catch (error) {
      console.error("Social signup error:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-neutral-950 ">
      <div className="shadow-input mx-auto w-full max-w-md p-4 rounded-2xl md:p-8 border-white border-2 bg-black">
        <h2 className="text-xl font-bold text-neutral-200">
          Welcome to Soft Game Studio
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-300">
          Secure access to your creative journey with Soft Game Studio.
        </p>
        <form className="my-8" onSubmit={handleEmailSignup}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                type="text"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                type="text"
                required
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user123@gmail.com"
              type="email"
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              type="password"
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="phone">Phone No.</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9999999999"
              type="tel"
              required
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md text-white bg-gradient-to-br bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              type="button"
              onClick={() => handleSocialSignup(providerGithub)}
              className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md px-4 font-medium text-black bg-zinc-900 shadow-[0px_0px_1px_1px_#262626]"
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-300" />
              <span className="text-sm text-neutral-300">GitHub</span>
              <BottomGradient />
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup(providerGoogle)}
              className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md px-4 font-medium text-black bg-zinc-900 shadow-[0px_0px_1px_1px_#262626]"
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
              <span className="text-sm text-neutral-300">Google</span>
              <BottomGradient />
            </button>
          </div>
        </form>
        <p className="text-center text-gray-200 text-sm mt-4">
          Already registered?
          <Link
            to="/Login"
            className="text-red-500 hover:underline font-medium ml-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

// Helper components
const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1 w-full", className)}>{children}</div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);
