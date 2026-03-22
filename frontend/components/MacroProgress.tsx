"use client";

interface Props {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
}

const MACROS = [
  { label: "Calories", color: "#ffb1ec", getValue: (p: Props) => `${Math.round(p.calories)} kcal` },
  { label: "Protein",  color: "#beefff", getValue: (p: Props) => `${Math.round(p.protein_g)}g` },
  { label: "Fats",     color: "#bfbeff", getValue: (p: Props) => `${Math.round(p.fats_g)}g` },
  { label: "Carbs",    color: "#fdccaf", getValue: (p: Props) => `${Math.round(p.carbs_g)}g` },
  { label: "Others",   color: "#e1e1e1", getValue: () => "0g" },
];

export default function MacroProgress(props: Props) {
  return (
    <div className="flex flex-col gap-[26px] w-full px-14 py-14">
      {MACROS.map(({ label, color, getValue }) => (
        <div key={label} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] rounded-[6px] shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[20px] text-black tracking-[-0.04em] font-normal">{label}</span>
          </div>
          <span className="text-[20px] text-black tracking-[-0.04em] font-normal">{getValue(props)}</span>
        </div>
      ))}
    </div>
  );
}
