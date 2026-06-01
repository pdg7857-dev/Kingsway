"use client";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, Legend,
} from "recharts";

const COLORS = ["hsl(72 95% 56%)", "hsl(265 89% 70%)", "hsl(38 92% 58%)", "hsl(210 92% 62%)", "hsl(150 80% 50%)"];

const usd0 = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function tipStyle() {
  return {
    contentStyle: {
      background: "hsl(0 0% 9%)",
      border: "1px solid hsl(0 0% 18%)",
      borderRadius: 12,
      fontSize: 12,
      color: "hsl(200 30% 97%)",
    },
    itemStyle: { color: "hsl(200 30% 97%)" },
    labelStyle: { color: "hsl(0 0% 66%)" },
  };
}

export function WasteDonut({ data }: { data: { label: string; valueCents: number; pct: number }[] }) {
  const t = tipStyle();
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="valueCents"
          nameKey="label"
          innerRadius={55}
          outerRadius={92}
          paddingAngle={2}
          stroke="hsl(0 0% 9%)"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          {...t}
          formatter={(v: any, _n: any, p: any) => [`${usd0(Number(v))} · ${p?.payload?.pct ?? 0}%`, p?.payload?.label]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BenchmarkBars({
  data,
}: {
  data: { metric: string; you: number; peerAvg: number; topQuartile: number }[];
}) {
  const t = tipStyle();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis dataKey="metric" tick={{ fill: "hsl(0 0% 66%)", fontSize: 10 }} interval={0} tickLine={false} axisLine={{ stroke: "hsl(0 0% 13%)" }} />
        <YAxis domain={[0, 100]} tick={{ fill: "hsl(216 14% 42%)", fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip {...t} cursor={{ fill: "hsl(0 0% 17% / 0.4)" }} />
        <Legend wrapperStyle={{ fontSize: 11, color: "hsl(0 0% 66%)" }} />
        <Bar dataKey="you" name="You" fill="hsl(72 95% 56%)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="peerAvg" name="Peer avg" fill="hsl(265 89% 70%)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="topQuartile" name="Top quartile" fill="hsl(214 15% 42%)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PeerIndexBars({
  data,
  highlight,
}: {
  data: { label: string; index: number }[];
  highlight: string;
}) {
  const t = tipStyle();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis type="category" dataKey="label" width={120} tick={{ fill: "hsl(0 0% 66%)", fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip {...t} cursor={{ fill: "hsl(0 0% 17% / 0.4)" }} />
        <Bar dataKey="index" name="Index" radius={[0, 4, 4, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.label === highlight ? "hsl(72 95% 56%)" : "hsl(265 60% 50%)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
