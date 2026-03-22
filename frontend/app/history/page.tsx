"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPeriodSummary } from "@/lib/api";
import { PeriodSummaryDay } from "@/lib/types";
import WeeklySummary from "@/components/WeeklySummary";
import MonthlySummary from "@/components/MonthlySummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {Math.round(value)}<span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
        </p>
      </CardContent>
    </Card>
  );
}

function computeStats(data: PeriodSummaryDay[]) {
  if (data.length === 0) return { avgCalories: 0, totalMacros: 0, bestDay: "—" };
  const avgCalories = data.reduce((s, d) => s + d.total_calories, 0) / data.length;
  const bestDay = data.reduce((best, d) => d.total_calories > best.total_calories ? d : best, data[0]);
  const bestDayStr = new Date(bestDay.date + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" });
  return { avgCalories, bestDay: bestDayStr };
}

export default function HistoryPage() {
  const [weekData, setWeekData] = useState<PeriodSummaryDay[]>([]);
  const [monthData, setMonthData] = useState<PeriodSummaryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPeriodSummary("week"), getPeriodSummary("month")])
      .then(([week, month]) => {
        setWeekData(week);
        setMonthData(month);
      })
      .catch(() => setError("Could not load history data."))
      .finally(() => setLoading(false));
  }, []);

  const weekStats = computeStats(weekData);
  const monthStats = computeStats(monthData);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">History</h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <Tabs defaultValue="week">
        <TabsList className="w-full">
          <TabsTrigger value="week" className="flex-1">This Week</TabsTrigger>
          <TabsTrigger value="month" className="flex-1">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Avg Daily Calories" value={weekStats.avgCalories} unit="kcal" />
            <Card>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Best Day</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{weekStats.bestDay}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Daily Breakdown (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              ) : weekData.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                  No data yet. Add some meals to see your weekly stats.
                </div>
              ) : (
                <WeeklySummary data={weekData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Avg Daily Calories" value={monthStats.avgCalories} unit="kcal" />
            <Card>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Best Day</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{monthStats.bestDay}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Calorie Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              ) : monthData.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                  No data yet. Add some meals to see your monthly trend.
                </div>
              ) : (
                <MonthlySummary data={monthData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
