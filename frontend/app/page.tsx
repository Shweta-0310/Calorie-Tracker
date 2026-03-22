"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTodaysMeals, getMealsByDate, deleteMeal } from "@/lib/api";
import { DailySummary } from "@/lib/types";
import MacroProgress from "@/components/MacroProgress";
import MealList from "@/components/MealList";
import DonutChart from "@/components/DonutChart";

function toLocalDateStr(date: Date): string {
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

function formatDateLabel(dateStr: string): string {
  const today = toLocalDateStr(new Date());
  const yesterday = toLocalDateStr(new Date(Date.now() - 86400000));
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateStr(new Date()));
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isToday = selectedDate === toLocalDateStr(new Date());

  async function load(date: string) {
    setLoading(true);
    try {
      const data = date === toLocalDateStr(new Date())
        ? await getTodaysMeals()
        : await getMealsByDate(date);
      setSummary(data);
    } catch {
      setError("Could not load meals. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("cal_tracker_user");
    if (!user) { router.replace("/login"); return; }
    load(selectedDate);
  }, [selectedDate]);

  function goToPrev() {
    setSelectedDate((prev) => {
      const d = new Date(prev + "T00:00:00");
      d.setDate(d.getDate() - 1);
      return toLocalDateStr(d);
    });
  }

  function goToNext() {
    if (isToday) return;
    setSelectedDate((prev) => {
      const d = new Date(prev + "T00:00:00");
      d.setDate(d.getDate() + 1);
      return toLocalDateStr(d);
    });
  }

  async function handleDelete(id: string) {
    await deleteMeal(id);
    load(selectedDate);
  }

  return (
    <div className="flex-1 flex flex-col items-center overflow-hidden pb-8">
      {error && (
        <div className="shrink-0 w-full max-w-300 mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-300 border-l border-r border-b border-[#888]">
        {/* Hero image */}
        <div className="shrink-0 w-full h-76 overflow-hidden">
          <img
            src="/hero.jpg"
            alt="Featured meal"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Date navigator */}
        <div className="shrink-0 flex items-center justify-center gap-14 py-5 border-b border-[#888]">
          <button
            onClick={goToPrev}
            className="text-[#161616] hover:opacity-60 transition-opacity w-[30px] h-[30px] flex items-center justify-center"
            aria-label="Previous day"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7L11 15L19 23" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="text-[24px] font-light text-[#161616] tracking-[-0.02em] min-w-[110px] text-center select-none leading-[27px]">
            {formatDateLabel(selectedDate)}
          </span>
          <button
            onClick={goToNext}
            disabled={isToday}
            className="text-[#161616] hover:opacity-60 transition-opacity w-[30px] h-[30px] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next day"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 7L19 15L11 23" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Stats + Meal Distribution */}
        <div className="flex flex-1 overflow-hidden border-b border-[#888]">
          {/* Left: donut chart + macro legend */}
          <div className="flex-1 flex flex-col items-center overflow-y-auto border-r border-[#888]">
            <DonutChart
              protein={summary?.total_protein_g ?? 0}
              carbs={summary?.total_carbs_g ?? 0}
              fats={summary?.total_fats_g ?? 0}
              totalMeals={summary?.meals.length ?? 0}
            />
            {loading ? (
              <div className="flex flex-col gap-6 w-full px-14 py-14">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <MacroProgress
                calories={summary?.total_calories ?? 0}
                protein_g={summary?.total_protein_g ?? 0}
                carbs_g={summary?.total_carbs_g ?? 0}
                fats_g={summary?.total_fats_g ?? 0}
              />
            )}
          </div>

          {/* Right: meal distribution */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col gap-8 p-6 overflow-y-auto">
              {(summary?.meals?.length ?? 0) > 0 && (
                <p className="text-[24px] font-light text-[#161616] tracking-[-0.02em] leading-6.75">
                  Meal Distribution
                </p>
              )}
              {loading ? (
                <div className="flex flex-col gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-23.5 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <MealList meals={summary?.meals ?? []} onDelete={handleDelete} addHref="/add" />
              )}
            </div>
            {(summary?.meals?.length ?? 0) > 0 && (
              <div className="shrink-0 p-6 pt-0 border-b border-[#888]">
                <Link
                  href="/add"
                  className="w-full h-12 bg-[#161616] text-white text-[18px] tracking-[-0.04em] rounded-[6px] hover:opacity-80 transition-opacity flex items-center justify-center"
                >
                  Add Meal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
