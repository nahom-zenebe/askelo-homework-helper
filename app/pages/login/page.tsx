"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/pages/homepage",
        rememberMe: true,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {

           router.push("/pages/homepage");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      }
    );
    toast("Login successful")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 shadow rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border  text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 border  text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link href="/pages/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() =>{
                authClient.signIn.social("google", { callbackURL: "/pages/homepage" })
                toast("Login successful")}
              }
              type="button"
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.5 0 6.5 1.2 9 3.4l6.8-6.8C35.3 2.2 29.9 0 24 0 14.8 0 6.8 5.8 2.7 14.2l7.9 6.1C12.6 13.1 17.8 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.5 0 12.1-2.2 16.1-5.9l-7.5-6.1c-2.1 1.4-4.8 2.2-8.6 2.2-6.2 0-11.5-3.8-13.3-9l-8.1 6.2C6.9 43.4 14.8 48 24 48z"
                />
                <path
                  fill="#4A90E2"
                  d="M40.2 24.5c0-1.7-.2-2.9-.5-4.1H24v7.7h9.3c-.5 2.4-2.1 4.2-4.4 5.6l7.1 5.6c4.1-3.7 6.5-9.1 6.5-15.2z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.7 28.8c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4L2.7 14.2C.9 17.7 0 21.7 0 24s.9 6.3 2.7 9.8l8-6.2z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
