"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import NutrientCard from "@/components/NutrientCard";
import { analyzeImage, saveMeal } from "@/lib/api";
import { NutrientData } from "@/lib/types";
import { Button } from "@/components/ui/button";

type Step = "upload" | "loading" | "preview" | "saving";

export default function AddMealPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [nutrients, setNutrients] = useState<(NutrientData & { image_url: string }) | null>(null);
  const [error, setError] = useState<string>("");

  async function handleFileSelected(selectedFile: File, preview: string) {
    setFile(selectedFile);
    setImagePreview(preview);
    setError("");
  }

  async function handleAnalyze() {
    if (!file) return;
    setStep("loading");
    setError("");
    try {
      const result = await analyzeImage(file);
      setNutrients(result);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setStep("upload");
    }
  }

  async function handleSave() {
    if (!nutrients) return;
    setStep("saving");
    try {
      await saveMeal({
        meal_name: nutrients.meal_name,
        calories: nutrients.calories,
        protein_g: nutrients.protein_g,
        carbs_g: nutrients.carbs_g,
        fats_g: nutrients.fats_g,
        image_url: nutrients.image_url,
        eaten_at: new Date().toISOString(),
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meal.");
      setStep("preview");
    }
  }

  function handleDiscard() {
    setFile(null);
    setImagePreview("");
    setNutrients(null);
    setError("");
    setStep("upload");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/")} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Add Meal</h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {step === "upload" && (
        <div className="flex flex-col gap-4">
          <ImageUploader onFileSelected={handleFileSelected} />
          {file && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button onClick={handleAnalyze} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Analyze with AI
              </Button>
            </div>
          )}
        </div>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Analyzing your meal with Gemini AI...</p>
        </div>
      )}

      {step === "preview" && nutrients && (
        <div className="flex flex-col gap-4">
          <NutrientCard data={nutrients} imagePreview={imagePreview} />
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Save Meal
            </Button>
            <Button variant="outline" onClick={handleAnalyze} className="flex-1">
              Re-analyze
            </Button>
            <Button variant="ghost" onClick={handleDiscard} className="text-gray-500">
              Discard
            </Button>
          </div>
        </div>
      )}

      {step === "saving" && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Saving your meal...</p>
        </div>
      )}
    </div>
  );
}
