"use client";

import {
  AreaChart,
  Area,
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

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function MonthlySummary({ data }: Props) {
  const chartData = data.map((d) => ({
    date: formatDate(d.date),
    Calories: Math.round(d.total_calories),
    Protein: Math.round(d.total_protein_g),
    Carbs: Math.round(d.total_carbs_g),
    Fat: Math.round(d.total_fats_g),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="Calories" stroke="#22c55e" fill="url(#calGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="Protein" stroke="#3b82f6" fill="transparent" strokeWidth={1.5} />
          <Area type="monotone" dataKey="Carbs" stroke="#f59e0b" fill="transparent" strokeWidth={1.5} />
          <Area type="monotone" dataKey="Fat" stroke="#ef4444" fill="transparent" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
