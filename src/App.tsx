import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProcessTable } from '@/components/ProcessTable';
import { SeriesChart } from '@/components/SeriesChart';
import { StatStrip } from '@/components/StatStrip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDay, fetchDays } from '@/lib/api';
import { formatDay, formatHour, loadSeries, memorySeries, temperatureSeries } from '@/lib/metrics';
import type { Reading } from '@/shared/types';

const REFRESH_MS = 5 * 60 * 1000;

export default function App() {
  const [days, setDays] = useState<string[]>([]);
  const [day, setDay] = useState('');
  const [readings, setReadings] = useState<Reading[]>([]);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchDays();
        const selected = day && list.includes(day) ? day : (list[0] ?? '');
        const data = selected ? await fetchDay(selected) : [];
        if (cancelled) return;
        setDays(list);
        setReadings(data);
        setError(false);
        if (selected !== day) setDay(selected);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [day, tick]);

  const last = readings.at(-1);

  return (
    <div className="mx-auto max-w-[1180px] px-[clamp(16px,4vw,48px)] pt-6 pb-12">
      <header className="mb-6 flex flex-wrap items-baseline gap-x-5 gap-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">SysMetrics</h1>
        <p className="min-w-52 flex-1 text-muted-foreground" aria-live="polite">
          {last
            ? `${readings.length} coletas, a última às ${formatHour(Date.parse(last.timestamp))}`
            : ''}
        </p>
        <label className="flex items-center gap-2 text-muted-foreground">
          Dia
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {formatDay(d)}
              </option>
            ))}
          </select>
        </label>
        <Button variant="outline" onClick={() => setTick((t) => t + 1)}>
          <RefreshCw className="size-4" /> Atualizar
        </Button>
      </header>

      {error && (
        <Card className="mb-5 border-l-4 border-l-primary">
          <CardContent>
            O servidor local não respondeu em 127.0.0.1:8765. Confira com:{' '}
            <code>systemctl --user status sysmetrics-dashboard</code>
          </CardContent>
        </Card>
      )}
      {!error && !last && (
        <Card className="mb-5 border-l-4 border-l-primary">
          <CardContent>
            Nenhum log encontrado. Rode sysmetrics_en.sh ou sysmetrics_pt.sh.
          </CardContent>
        </Card>
      )}

      {last && (
        <main className="flex flex-col gap-5">
          <StatStrip reading={last} />
          <Card>
            <CardHeader>
              <CardTitle>Temperaturas</CardTitle>
            </CardHeader>
            <CardContent>
              <SeriesChart series={temperatureSeries(readings)} unit="°" />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Carga média de 1 minuto</CardTitle>
              </CardHeader>
              <CardContent>
                <SeriesChart series={loadSeries(readings)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Memória RAM usada</CardTitle>
              </CardHeader>
              <CardContent>
                <SeriesChart series={memorySeries(readings)} unit="%" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Processos mais ativos na última coleta</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessTable processes={last.processes} />
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  );
}
