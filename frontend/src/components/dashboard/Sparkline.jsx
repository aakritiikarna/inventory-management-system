/**
 * Minimal, dependency-free sparkline — deliberately NOT built on recharts.
 * Six ResponsiveContainer+AreaChart instances mounting at once inside the
 * KPI cards (one per card) is a known crash source under React 19's
 * StrictMode double-render (confirmed: this exact combination threw
 * "Element type is invalid" here). A plain SVG polyline has no such
 * failure mode and is plenty for a small trend indicator.
 */
const Sparkline = ({ values = [], color = "#2563eb", height = 32 }) => {
  const clean = (values || []).filter(
    (v) => typeof v === "number" && Number.isFinite(v)
  );

  if (clean.length < 2) return null;

  const width = 100;
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min || 1;

  const points = clean.map((v, i) => {
    const x = (i / (clean.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });

  const areaPoints = `0,${height} ${points.join(" ")} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      <polygon points={areaPoints} fill={color} opacity={0.15} />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;
