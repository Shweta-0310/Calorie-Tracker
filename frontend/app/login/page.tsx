"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter your name."); return; }
    setLoading(true);
    setError("");
    try {
      await loginUser(trimmed);
      localStorage.setItem("cal_tracker_user", trimmed.toLowerCase());
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[1200px] border-l border-r border-[#888] min-h-screen">
        {/* Hero image */}
        <div className="w-full h-[304px] overflow-hidden">
          <img src="/hero.jpg" alt="Food" className="w-full h-full object-cover" />
        </div>

        {/* Form */}
        <div className="flex flex-col items-center justify-center px-6 py-32 gap-8">
          <div className="flex flex-col items-center gap-6 w-full max-w-[240px]">
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              className="w-full bg-transparent border-b border-gray-400 pb-2 text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors text-center"
              autoFocus
            />
            <button
              onClick={handleContinue}
              disabled={loading}
              className="w-full bg-black text-white text-[15px] py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
