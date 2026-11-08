import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { chartRows, formatHour, formatNumber, type Series } from '@/lib/metrics';

const COLORS = ['#d9480f', '#1c7ed6', '#2f9e44', '#ae3ec9', '#e8a317', '#0b7285'];
const AXIS = { stroke: 'var(--muted-foreground)', fontSize: 11 };

export function SeriesChart({ series, unit = '' }: { series: Series[]; unit?: string }) {
  const rows = chartRows(series);
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Sem dados neste dia.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={rows}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="t"
          type="number"
          scale="time"
          domain={['dataMin', 'dataMax']}
          tickFormatter={formatHour}
          {...AXIS}
        />
        <YAxis
          domain={['auto', 'auto']}
          width={56}
          tickFormatter={(v: number) => `${formatNumber(v)}${unit}`}
          {...AXIS}
        />
        <Tooltip
          labelFormatter={(t) => formatHour(Number(t))}
          formatter={(v) => `${formatNumber(Number(v))}${unit}`}
          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        />
        {series.length > 1 && <Legend />}
        {series.map((s, i) => (
          <Line
            key={s.name}
            dataKey={s.name}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
