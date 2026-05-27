"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { fmtCents, fmtCompact } from "@/lib/utils";

export function RevenueByBusinessChart({
  data,
}: {
  data: { name: string; revenue: number; profit: number; color: string }[];
}) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 24% 17%)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "hsl(215 16% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v: number) => `$${fmtCompact(v / 100)}`}
            tick={{ fill: "hsl(215 16% 65%)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "hsl(222 28% 14%)" }}
            contentStyle={{
              background: "hsl(222 36% 9%)",
              border: "1px solid hsl(222 24% 17%)",
              borderRadius: 10,
              fontSize: 12,
            }}
            formatter={(value: number, name) => [fmtCents(value), name]}
          />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CashFlowChart({
  data,
}: {
  data: { day: string; net: number }[];
}) {
  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 24% 17%)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "hsl(215 16% 65%)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v: number) => `$${fmtCompact(v / 100)}`} tick={{ fill: "hsl(215 16% 65%)", fontSize: 10 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip
            cursor={{ fill: "hsl(222 28% 14%)" }}
            contentStyle={{
              background: "hsl(222 36% 9%)",
              border: "1px solid hsl(222 24% 17%)",
              borderRadius: 10,
              fontSize: 12,
            }}
            formatter={(v: number) => fmtCents(v)}
          />
          <Bar dataKey="net" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.net >= 0 ? "hsl(150 80% 50%)" : "hsl(0 84% 62%)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
