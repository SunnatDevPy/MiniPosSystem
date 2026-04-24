export default function SalesLineChart({ points }) {
  const width = 980;
  const height = 260;
  const padding = 42;
  const maxVal = Math.max(1, ...points.map((p) => p.amount || 0));
  const stepX = (width - padding * 2) / Math.max(1, points.length - 1);
  const toY = (val) => height - padding - (val / maxVal) * (height - padding * 2);
  const yTicks = 5;
  const lineA = points
    .map((p, i) => `${padding + i * stepX},${toY(p.amount || 0)}`)
    .join(" ");
  const lineB = points
    .map((p, i) => `${padding + i * stepX},${toY((p.amount || 0) * 0.18)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sales-line-svg" role="img" aria-label="Sales chart">
      {[...Array(yTicks)].map((_, x) => {
        const y = padding + ((height - padding * 2) / (yTicks - 1)) * x;
        const val = Math.round(maxVal - (maxVal / (yTicks - 1)) * x);
        return (
          <g key={x}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} className="chart-grid-line" />
            <text x={8} y={y + 4} className="chart-axis-text">{val.toLocaleString("ru-RU")}</text>
          </g>
        );
      })}
      <polyline points={lineB} className="chart-line chart-line-secondary" />
      <polyline points={lineA} className="chart-line chart-line-primary" />
      {points.map((p, i) => (
        <g key={`${p.hour}-${i}`}>
          <circle cx={padding + i * stepX} cy={toY(p.amount || 0)} r="2.6" className="chart-dot-primary" />
          {i % 2 === 0 && <text x={padding + i * stepX - 10} y={height - 8} className="chart-axis-text">{p.hour}</text>}
        </g>
      ))}
    </svg>
  );
}
