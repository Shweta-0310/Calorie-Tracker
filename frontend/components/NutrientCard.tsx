"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, PieLabelRenderProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NutrientData } from "@/lib/types";

interface Props {
  data: NutrientData & { image_url?: string };
  imagePreview?: string;
}

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const RADIAN = Math.PI / 180;
function renderCustomLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (
    cx == null || cy == null || midAngle == null ||
    innerRadius == null || outerRadius == null || percent == null ||
    (percent as number) <= 0.05
  ) return null;
  const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5;
  const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN);
  const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${((percent as number) * 100).toFixed(0)}%`}
    </text>
  );
}

export default function NutrientCard({ data, imagePreview }: Props) {
  const proteinCal = data.protein_g * 4;
  const carbsCal = data.carbs_g * 4;
  const fatsCal = data.fats_g * 9;

  const pieData = [
    { name: "Protein", value: proteinCal },
    { name: "Carbs", value: carbsCal },
    { name: "Fat", value: fatsCal },
  ].filter((d) => d.value > 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{data.meal_name}</CardTitle>
        <p className="text-3xl font-bold text-green-600">{Math.round(data.calories)} kcal</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Image preview */}
          {(imagePreview ?? data.image_url) && (
            <img
              src={imagePreview ?? data.image_url}
              alt={data.meal_name}
              className="w-40 h-40 object-cover rounded-xl shrink-0"
            />
          )}

          {/* Donut chart */}
          <div className="w-44 h-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${Math.round(Number(v))} kcal`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Macro details */}
          <div className="flex flex-col gap-3 flex-1">
            <MacroRow label="Protein" value={data.protein_g} unit="g" color="bg-green-500" />
            <MacroRow label="Carbs" value={data.carbs_g} unit="g" color="bg-amber-500" />
            <MacroRow label="Fats" value={data.fats_g} unit="g" color="bg-red-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MacroRow({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <Badge variant="secondary" className="font-mono">
        {value.toFixed(1)}{unit}
      </Badge>
    </div>
  );
}
