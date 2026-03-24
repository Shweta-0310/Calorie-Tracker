"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {/* Full-screen background image */}
      <img
        src="/hero.jpg"
        alt="Food"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl px-10 py-12 flex flex-col items-center gap-6 w-full max-w-sm mx-4 shadow-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-black tracking-tight">Cal Tracker</h1>
          <p className="text-sm text-gray-500 leading-snug">
            Understand your food choices. Make informed decisions about what you consume.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 border border-gray-300 text-gray-700 text-[14px] px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          {!loading && (
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.611 20.083H42V20H24v8h11.303C33.928 32.082 29.418 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 35c-5.399 0-9.902-2.909-12.28-7.202l-6.524 5.026C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
          )}
          {loading ? "Redirecting..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
