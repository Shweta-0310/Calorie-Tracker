"use client";

import { Meal } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  meals: Meal[];
  onDelete: (id: string) => void;
}

export default function MealList({ meals, onDelete }: Props) {
  if (meals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-2">🍽</p>
        <p className="text-sm">No meals logged today. Add your first meal!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {meals.map((meal) => (
        <Card key={meal.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 p-3">
              {meal.image_url ? (
                <img
                  src={meal.image_url}
                  alt={meal.meal_name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  🍴
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{meal.meal_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(meal.eaten_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">P: {meal.protein_g.toFixed(0)}g</Badge>
                  <Badge variant="secondary" className="text-xs">C: {meal.carbs_g.toFixed(0)}g</Badge>
                  <Badge variant="secondary" className="text-xs">F: {meal.fats_g.toFixed(0)}g</Badge>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-lg font-bold text-green-600">{Math.round(meal.calories)}</span>
                <span className="text-xs text-gray-400">kcal</span>
                <button
                  onClick={() => onDelete(meal.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                  aria-label="Delete meal"
                >
                  ✕
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
