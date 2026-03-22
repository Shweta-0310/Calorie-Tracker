"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("cal_tracker_user");
    router.push("/login");
  }

  return (
    <header className="w-full border-b border-[#888] bg-white flex items-center justify-center">
      <div className="w-full max-w-[1200px] md:border-l md:border-r border-[#888] px-6 py-4 md:py-6 flex items-center justify-between">
        <span className="text-[23px] font-bold text-black tracking-[-0.04em]">Cal Tracker</span>
        <button
          onClick={handleLogout}
          className="text-[#ff4242] hover:text-red-600 text-[14px] tracking-[-0.04em] transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
