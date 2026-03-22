export interface NutrientData {
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
}

export interface Meal extends NutrientData {
  id: string;
  image_url: string;
  eaten_at: string;
  created_at: string;
}

export interface DailySummary {
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fats_g: number;
  meals: Meal[];
}

export interface PeriodSummaryDay {
  date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fats_g: number;
}

export const DAILY_TARGETS = {
  calories: 2000,
  protein_g: 150,
  carbs_g: 250,
  fats_g: 65,
};
