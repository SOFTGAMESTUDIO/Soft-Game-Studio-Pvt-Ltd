import React, { useState } from "react";
import { Input } from "../../UiComponents/input";
import { Label } from "../../UiComponents/label";
import { cn } from "../../Library/utils";
import { sendResetPasswordEmail } from "../../Modules/SetNewPassword";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "../../components/layout/Layout";

export default function UserResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required!");

    setLoading(true);
    try {
      await sendResetPasswordEmail(email);
      setEmailSent(true);
      toast.success("Reset email sent! Check your inbox.");
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen p-4 bg-purple-100 dark:bg-neutral-950">
        <Helmet>
          <title>Reset Password | Soft Game Studio</title>
          <meta
            name="description"
            content="Forgot your password? Reset it easily at Soft Game Studio. Secure password recovery for your account to regain access to projects, exams, and courses."
          />
          <meta
            name="keywords"
            content="Reset Password, Forgot Password, Recover Account, Soft Game Studio, Account Help, Student Login, Developer Account Recovery"
          />
          <meta name="author" content="Soft Game Studio" />

          <meta property="og:title" content="Reset Password | Soft Game Studio" />
          <meta
            property="og:description"
            content="Use our secure password reset process to recover your Soft Game Studio account. Quick access to your learning and project dashboard."
          />
          <meta
            property="og:url"
            content="https://softgamestudio.web.app/reset-password"
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/Designer.png?alt=media&token=3e6ee22e-f7f7-4d73-8ce7-0b1441ed3050"
          />
        </Helmet>

        <div className="w-full max-w-md p-6 rounded-xl shadow-input bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Forgot Password?</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
            Enter your email to receive a reset link.
          </p>

          <form onSubmit={handleSendEmail} className="mt-6 space-y-4">
            <LabelInputContainer>
              <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailSent}
                className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </LabelInputContainer>

            <button
              type="submit"
              disabled={loading}
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-purple-500 to-purple-700 dark:from-neutral-800 dark:to-neutral-900 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            >
              {loading
                ? "Sending..."
                : emailSent
                ? "Resend Email"
                : "Send Reset Email"}
              <BottomGradient />
            </button>

            {emailSent && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                Email sent! Please check your inbox. Didn't get it? Click above to
                resend.
              </p>
            )}
          </form>

          <p className="text-center text-sm text-neutral-600 dark:text-neutral-300 mt-4">
            Remember your password?{" "}
            <Link
              to="/Login"
              className="text-purple-600 dark:text-red-500 hover:underline font-semibold"
            >
              Go back to Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-purple-400 dark:via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-purple-500 dark:via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);