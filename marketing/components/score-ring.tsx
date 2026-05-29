function scoreColor(score: number): string {
  if (score >= 80) return "hsl(150 70% 50%)";
  if (score >= 70) return "hsl(186 100% 55%)";
  if (score >= 60) return "hsl(210 90% 60%)";
  return "hsl(220 10% 50%)";
}

export function ScoreRing({ score, size = 96, label = "GOII™" }: { score: number; size?: number; label?: string }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const color = scoreColor(score);
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(220 14% 20%)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="absolute text-center leading-none">
        <div className="font-mono font-semibold" style={{ color, fontSize: size * 0.28 }}>{score}</div>
        <div className="text-[8px] uppercase tracking-wider text-fg-subtle mt-0.5">{label}</div>
      </div>
    </div>
  );
}
