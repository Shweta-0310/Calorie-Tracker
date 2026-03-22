"use client";

import { Progress } from "@/components/ui/progress";
import { DAILY_TARGETS } from "@/lib/types";

interface Props {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
}

export default function MacroProgress({ calories, protein_g, carbs_g, fats_g }: Props) {
  const macros = [
    { label: "Calories", consumed: calories, target: DAILY_TARGETS.calories, unit: "kcal", color: "bg-green-500" },
    { label: "Protein", consumed: protein_g, target: DAILY_TARGETS.protein_g, unit: "g", color: "bg-blue-500" },
    { label: "Carbs", consumed: carbs_g, target: DAILY_TARGETS.carbs_g, unit: "g", color: "bg-amber-500" },
    { label: "Fats", consumed: fats_g, target: DAILY_TARGETS.fats_g, unit: "g", color: "bg-red-500" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {macros.map(({ label, consumed, target, unit, color }) => {
        const pct = Math.min((consumed / target) * 100, 100);
        const over = consumed > target;
        return (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
              <span className={over ? "text-red-500" : "text-gray-500 dark:text-gray-400"}>
                {Math.round(consumed)}{unit} / {target}{unit}
                {over && " ⚠"}
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${over ? "bg-red-500" : pct > 80 ? "bg-amber-500" : color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
