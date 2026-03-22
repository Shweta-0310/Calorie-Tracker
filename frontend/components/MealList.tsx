"use client";

import Link from "next/link";
import { Meal } from "@/lib/types";

interface Props {
  meals: Meal[];
  onDelete: (id: string) => void;
  addHref?: string;
}

export default function MealList({ meals, onDelete, addHref }: Props) {
  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-full text-gray-400">
        <div className="flex flex-col items-center gap-2">
          <p className="text-4xl">🍽</p>
          <p className="text-sm">No meals logged today. Add your first meal!</p>
        </div>
        {addHref && (
          <Link
            href={addHref}
            className="w-50 h-12 bg-[#161616] text-white text-[18px] tracking-[-0.04em] rounded-[6px] hover:opacity-80 transition-opacity flex items-center justify-center"
          >
            Add Meal
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="flex items-start gap-4 p-3 bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg"
        >
          {meal.image_url ? (
            <img
              src={meal.image_url}
              alt={meal.meal_name}
              className="w-[66px] h-[70px] object-cover rounded-[5px] shrink-0"
            />
          ) : (
            <div className="w-[66px] h-[70px] bg-gray-200 rounded-[5px] flex items-center justify-center text-xl shrink-0">
              🍴
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[22px] font-medium text-[#161616] tracking-[-0.02em] truncate leading-tight">
                {meal.meal_name}
              </p>
              <span className="text-[20px] text-[#161616] tracking-[-0.02em] shrink-0 whitespace-nowrap">
                {Math.round(meal.calories)} kcal
              </span>
            </div>
            <div className="flex gap-3 text-[16px] text-[#161616] tracking-[-0.02em]">
              <span>P: {meal.protein_g.toFixed(0)}g</span>
              <span>C: {meal.carbs_g.toFixed(0)}g</span>
              <span>F: {meal.fats_g.toFixed(0)}g</span>
            </div>
          </div>

          <button
            onClick={() => onDelete(meal.id)}
            className="text-gray-300 hover:text-red-400 transition-colors text-xs shrink-0 self-start mt-1"
            aria-label="Delete meal"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
