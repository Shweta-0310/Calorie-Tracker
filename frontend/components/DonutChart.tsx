"use client";

interface Props {
  protein: number;
  carbs: number;
  fats: number;
  totalMeals: number;
}

export default function DonutChart({ protein, carbs, fats, totalMeals }: Props) {
  const r = 100;
  const cx = 123;
  const cy = 123;
  const circumference = 2 * Math.PI * r;
  const total = protein + carbs + fats || 1;
  const hasData = protein + carbs + fats > 0;

  const segments = hasData
    ? [
        { value: protein, color: "#beefff" },
        { value: fats, color: "#ffb1ec" },
        { value: carbs, color: "#fdccaf" },
      ]
    : [{ value: 1, color: "#ebebeb" }];

  let accumulated = 0;

  return (
    <div className="flex flex-col items-center justify-center pt-6">
      <svg viewBox="0 0 246 246" className="w-61.75 h-61.75">
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
          y={cy - 8}
          textAnchor="middle"
          style={{ fontSize: 64, fontWeight: 400, fill: "#161616", letterSpacing: "-1.28px", fontFamily: "Inter, sans-serif" }}
        >
          {String(totalMeals).padStart(2, "0")}
        </text>
        <text
          x={cx}
          y={cy + 26}
          textAnchor="middle"
          style={{ fontSize: 24, fontWeight: 300, fill: "#161616", letterSpacing: "-0.48px", fontFamily: "Inter, sans-serif" }}
        >
          Total Meal
        </text>
      </svg>
    </div>
  );
}
