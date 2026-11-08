import { describe, expect, it } from 'vitest';
import { reading } from '@/test/fixture';
import { chartRows, formatDay, memorySeries, summarize, temperatureSeries } from './metrics';

describe('metrics', () => {
  it('temperatureSeries cria uma série por sensor, nomeada chip e sensor', () => {
    const later = { ...reading, timestamp: '2026-11-05T09:05:00-03:00' };
    const series = temperatureSeries([reading, later]);
    expect(series.map((s) => s.name)).toEqual(['k10temp Tctl', 'nvme Composite']);
    expect(series[0]?.points).toHaveLength(2);
  });

  it('memorySeries calcula o uso de RAM em porcentagem', () => {
    expect(memorySeries([reading])[0]?.points[0]?.v).toBe(25);
  });

  it('chartRows junta séries pelo horário e ordena', () => {
    const rows = chartRows([
      {
        name: 'a',
        points: [
          { t: 2, v: 20 },
          { t: 1, v: 10 },
        ],
      },
      { name: 'b', points: [{ t: 1, v: 5 }] },
    ]);
    expect(rows).toEqual([
      { t: 1, a: 10, b: 5 },
      { t: 2, a: 20 },
    ]);
  });

  it('formatDay troca AAAAMMDD por DD/MM/AAAA', () => {
    expect(formatDay('20261105')).toBe('05/11/2026');
  });

  it('summarize lista temperaturas, memória, disco, carga e uptime', () => {
    const labels = summarize(reading).map((s) => s.label);
    expect(labels).toEqual([
      'k10temp Tctl',
      'nvme Composite',
      'RAM usada',
      'Swap usada',
      'Disco /',
      'Carga de 1 min',
      'Ligado há',
    ]);
  });
});
