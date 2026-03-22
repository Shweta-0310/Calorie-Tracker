"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PeriodSummaryDay } from "@/lib/types";

interface Props {
  data: PeriodSummaryDay[];
}

function formatDay(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString([], { weekday: "short", month: "numeric", day: "numeric" });
}

export default function WeeklySummary({ data }: Props) {
  const chartData = data.map((d) => ({
    day: formatDay(d.date),
    Calories: Math.round(d.total_calories),
    Protein: Math.round(d.total_protein_g),
    Carbs: Math.round(d.total_carbs_g),
    Fat: Math.round(d.total_fats_g),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Calories" fill="#22c55e" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Protein" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Carbs" fill="#f59e0b" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Fat" fill="#ef4444" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
