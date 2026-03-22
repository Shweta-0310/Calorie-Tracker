"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTodaysMeals, deleteMeal } from "@/lib/api";
import { DailySummary } from "@/lib/types";
import MacroProgress from "@/components/MacroProgress";
import MealList from "@/components/MealList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await getTodaysMeals();
      setSummary(data);
    } catch {
      setError("Could not load today's meals. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    await deleteMeal(id);
    load();
  }

  const today = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cal Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{today}</p>
        </div>
        <Link
          href="/history"
          className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          History →
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Daily macros summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today&apos;s Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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
        </CardContent>
      </Card>

      {/* Meals list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Meals ({summary?.meals.length ?? 0})
          </h2>
          {summary && summary.meals.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(summary.total_calories)} kcal total
            </span>
          )}
        </div>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <MealList meals={summary?.meals ?? []} onDelete={handleDelete} />
        )}
      </div>

      {/* FAB Add button */}
      <Link
        href="/add"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors"
        aria-label="Add meal"
      >
        +
      </Link>
    </div>
  );
}
