"use client";

interface Props {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  totalMeals: number;
}

export default function DonutChart({ protein, carbs, fats, calories, totalMeals }: Props) {
  const r = 100;
  const cx = 123;
  const cy = 123;
  const circumference = 2 * Math.PI * r;

  const macroCal = protein * 4 + fats * 9 + carbs * 4;
  const others = Math.max(0, calories - macroCal);
  const total = calories + protein + fats + carbs + others || 1;
  const hasData = calories + protein + fats + carbs > 0;

  const segments = hasData
    ? [
        { value: calories, color: "#ffb1ec" },
        { value: protein, color: "#beefff" },
        { value: fats,    color: "#bfbeff" },
        { value: carbs,   color: "#fdccaf" },
        { value: others,  color: "#e1e1e1" },
      ].filter(s => s.value > 0)
    : [{ value: 1, color: "#ebebeb" }];

  let accumulated = 0;

  return (
    <div className="flex flex-col items-center justify-center pt-6">
      <svg viewBox="0 0 246 246" className="w-44 h-44 md:w-61.75 md:h-61.75">
        {segments.map(({ value, color }, i) => {
          const pct = value / total;
          const dash = Math.max(pct * circumference - (hasData ? 4 : 0), 0);
          const gap = circumference - dash;
          const dashoffset = -(accumulated * circumference);
          accumulated += pct;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={23}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashoffset}
              style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
            />
          );
        })}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          style={{ fontSize: 64, fontWeight: 400, fill: "#161616", letterSpacing: "-1.28px", fontFamily: "Inter, sans-serif" }}
        >
          {String(totalMeals).padStart(2, "0")}
        </text>
        <text
          x={cx}
          y={cy + 38}
          textAnchor="middle"
          style={{ fontSize: 24, fontWeight: 300, fill: "#161616", letterSpacing: "-0.48px", fontFamily: "Inter, sans-serif" }}
        >
          Total Meal
        </text>
      </svg>
    </div>
  );
}
