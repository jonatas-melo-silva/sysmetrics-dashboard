import type { Reading } from '@/shared/types';

export const GIB = 1024 ** 3;

export interface Point {
  t: number;
  v: number;
}
export interface Series {
  name: string;
  points: Point[];
}
export interface Stat {
  label: string;
  value: string;
}

export function formatNumber(n: number, digits = 1): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export const formatHour = (t: number) =>
  new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export const formatDay = (d: string) => `${d.slice(6)}/${d.slice(4, 6)}/${d.slice(0, 4)}`;

/** Uma série por sensor, nomeada "chip sensor". */
export function temperatureSeries(readings: Reading[]): Series[] {
  const bySensor = new Map<string, Point[]>();
  for (const r of readings) {
    const t = Date.parse(r.timestamp);
    for (const [chip, sensors] of Object.entries(r.temperatures_c ?? {})) {
      for (const [sensor, v] of Object.entries(sensors)) {
        const key = `${chip} ${sensor}`;
        const points = bySensor.get(key) ?? [];
        points.push({ t, v });
        bySensor.set(key, points);
      }
    }
  }
  return [...bySensor].map(([name, points]) => ({ name, points }));
}

export const loadSeries = (readings: Reading[]): Series[] => [
  {
    name: 'Carga de 1 min',
    points: readings.map((r) => ({ t: Date.parse(r.timestamp), v: r.system.load.avg_1m })),
  },
];

export const memorySeries = (readings: Reading[]): Series[] => [
  {
    name: 'RAM usada',
    points: readings.map((r) => ({
      t: Date.parse(r.timestamp),
      v: (r.memory.ram.used_bytes / r.memory.ram.total_bytes) * 100,
    })),
  },
];

/** Linhas por horário, no formato que o Recharts espera. */
export function chartRows(series: Series[]): Array<Record<string, number>> {
  const rows = new Map<number, Record<string, number>>();
  for (const s of series) {
    for (const { t, v } of s.points) {
      const row = rows.get(t) ?? { t };
      row[s.name] = v;
      rows.set(t, row);
    }
  }
  return [...rows.values()].sort((a, b) => (a.t ?? 0) - (b.t ?? 0));
}

/** Itens da faixa com a última leitura. */
export function summarize(r: Reading): Stat[] {
  const { ram, swap } = r.memory;
  const disk = r.disk[0];
  const stats: Stat[] = [];
  for (const [chip, sensors] of Object.entries(r.temperatures_c)) {
    for (const [sensor, v] of Object.entries(sensors)) {
      stats.push({ label: `${chip} ${sensor}`, value: `${formatNumber(v)} °C` });
    }
  }
  stats.push({
    label: 'RAM usada',
    value: `${formatNumber(ram.used_bytes / GIB)} de ${formatNumber(ram.total_bytes / GIB)} GiB`,
  });
  stats.push({
    label: 'Swap usada',
    value: `${formatNumber(swap.used_bytes / GIB)} de ${formatNumber(swap.total_bytes / GIB)} GiB`,
  });
  if (disk) {
    stats.push({
      label: `Disco ${disk.mount}`,
      value: `${formatNumber(disk.used_pct, 0)}% de ${formatNumber(disk.total_bytes / GIB, 0)} GiB`,
    });
  }
  stats.push({
    label: 'Carga de 1 min',
    value: `${formatNumber(r.system.load.avg_1m, 2)} em ${r.system.cpu_threads} threads`,
  });
  stats.push({ label: 'Ligado há', value: `${formatNumber(r.system.uptime_s / 3600)} h` });
  return stats;
}
