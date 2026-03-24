"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { loginUser } from "@/lib/api";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    async function handleCallback() {
      // Handle PKCE flow (code in URL query params)
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) { setError("Authentication failed. Please try again."); return; }
        if (data.session?.user?.email) {
          await finalize(data.session.user.email);
          return;
        }
      }

      // Handle implicit flow (session auto-detected from URL hash)
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email) {
        await finalize(data.session.user.email);
        return;
      }

      setError("Authentication failed. Please try again.");
    }

    async function finalize(email: string) {
      try {
        await loginUser(email);
        localStorage.setItem("cal_tracker_user", email);
        router.push("/");
      } catch {
        setError("Login failed. Please try again.");
      }
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="text-sm underline text-gray-600"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-sm">Signing in...</p>
    </div>
  );
}
