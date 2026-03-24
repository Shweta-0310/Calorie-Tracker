"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { analyzeImage, saveMeal } from "@/lib/api";
import { NutrientData } from "@/lib/types";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

type Step = "upload" | "loading" | "preview" | "saving";

export default function AddMealModal({ onClose, onSaved }: Props) {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [nutrients, setNutrients] = useState<(NutrientData & { image_url: string }) | null>(null);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length === 0) return;
    const f = accepted[0];
    setFile(f);
    setImagePreview(URL.createObjectURL(f));
    setError("");
    setStep("upload");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

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
      onSaved();
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

  const isLoading = step === "loading" || step === "saving";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
          <p className="text-[18px] font-medium text-[#161616] tracking-[-0.02em]">Add Meal</p>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#161616] transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Image drop zone */}
        <div className="p-4">
          <div
            {...getRootProps()}
            className={`relative flex items-center justify-center h-52 cursor-pointer transition-colors overflow-hidden rounded-xl ${
              isDragActive ? "bg-[#d4d4d4]" : "bg-[#eaeaea]"
            }`}
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <img src={imagePreview} alt="meal preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center px-4">
                <svg width="32" height="32" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M49 38.5V44.3333C49 45.7478 48.4381 47.1044 47.4379 48.1046C46.4377 49.1048 45.0811 49.6667 43.6667 49.6667H12.3333C10.9188 49.6667 9.56226 49.1048 8.56206 48.1046C7.56187 47.1044 7 45.7478 7 44.3333V38.5" stroke="#888888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M39.6667 18.6667L28 7L16.3333 18.6667" stroke="#888888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M28 7V38.5" stroke="#888888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[15px] text-[#888] tracking-[-0.02em]">Drop a food photo or click to select</p>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-size-[200%_100%] animate-shimmer bg-linear-to-r from-white/10 via-white/50 to-white/10" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-4 px-6 pt-4 pb-6">

          {error && (
            <p className="text-[#ff4242] text-[14px] text-center tracking-[-0.02em] w-full">{error}</p>
          )}

          {/* Upload step */}
          {step === "upload" && (
            <>
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className="w-full h-11 bg-[#161616] text-white text-[18px] tracking-[-0.04em] rounded-[6px] disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
              >
                Analyse Meal
              </button>
            </>
          )}

          {/* Loading / saving step */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 w-full">
              <p
                className="text-[18px] font-medium tracking-[-0.02em] text-center text-[#161616]"
              >
                {step === "loading" ? "Analysing with AI..." : "Saving your meal..."}
              </p>
            </div>
          )}

          {/* Preview step */}
          {step === "preview" && nutrients && (
            <>
              <p className="text-[20px] font-medium text-[#161616] tracking-[-0.02em] w-full">
                Nutrient Distribution
              </p>

              <div className="flex flex-col gap-4 w-full">
                {[
                  { label: "Calories", value: `${Math.round(nutrients.calories)} kcal` },
                  { label: "Protein",  value: `${Math.round(nutrients.protein_g)}g` },
                  { label: "Fats",     value: `${Math.round(nutrients.fats_g)}g` },
                  { label: "Carbs",    value: `${Math.round(nutrients.carbs_g)}g` },
                  { label: "Others",   value: "0g" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[18px] text-[#161616] tracking-[-0.02em]">{label}</span>
                    <span className="text-[18px] text-[#161616] tracking-[-0.02em]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleDiscard}
                  className="flex-1 h-11 border border-[#161616] text-[#161616] text-[18px] tracking-[-0.04em] rounded-[6px] hover:opacity-60 transition-opacity"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-11 bg-[#161616] text-white text-[18px] tracking-[-0.04em] rounded-[6px] hover:opacity-80 transition-opacity"
                >
                  Save Meal
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
