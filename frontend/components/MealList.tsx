"use client";

import { Meal } from "@/lib/types";

interface Props {
  meals: Meal[];
  onDelete: (id: string) => void;
  onAdd?: () => void;
}

export default function MealList({ meals, onDelete, onAdd }: Props) {
  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-full text-gray-400">
        <div className="flex flex-col items-center gap-2">
          <p className="text-4xl">🍽</p>
          <p className="text-sm">No meals logged today. Add your first meal!</p>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="w-50 h-12 bg-[#161616] text-white text-[18px] tracking-[-0.04em] rounded-[6px] hover:opacity-80 transition-opacity flex items-center justify-center [@media(max-width:400px)]:fixed [@media(max-width:400px)]:bottom-0 [@media(max-width:400px)]:left-0 [@media(max-width:400px)]:right-0 [@media(max-width:400px)]:w-full [@media(max-width:400px)]:rounded-none [@media(max-width:400px)]:z-20"
          >
            Add Meal
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="flex items-start gap-3 p-3 bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg"
        >
          {meal.image_url ? (
            <img
              src={meal.image_url}
              alt={meal.meal_name}
              className="w-13 h-14 md:w-16.5 md:h-17.5 object-cover rounded-[5px] shrink-0"
            />
          ) : (
            <div className="w-13 h-14 md:w-16.5 md:h-17.5 bg-gray-200 rounded-[5px] flex items-center justify-center text-xl shrink-0">
              🍴
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col gap-1 self-stretch">
            <p className="text-[18px] font-medium text-[#161616] tracking-[-0.02em] truncate leading-tight">
              {meal.meal_name}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3 text-[16px] text-[#161616] tracking-[-0.02em]">
              <span>Protein: {meal.protein_g.toFixed(0)}g</span>
              <span>Carbs: {meal.carbs_g.toFixed(0)}g</span>
              <span>Fats: {meal.fats_g.toFixed(0)}g</span>
              <span>{Math.round(meal.calories)} kcal</span>
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
