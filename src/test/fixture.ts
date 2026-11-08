import type { Reading } from '@/shared/types';

const GIB = 1024 ** 3;

export const reading: Reading = {
  timestamp: '2026-11-05T09:00:00-03:00',
  cpu: { mhz_max: 3900, mhz_min: 1600, mhz_current_avg: 2100 },
  temperatures_c: { k10temp: { Tctl: 40.4 }, nvme: { Composite: 39.9 } },
  memory: {
    ram: {
      total_bytes: 16 * GIB,
      used_bytes: 4 * GIB,
      free_bytes: 8 * GIB,
      shared_bytes: 0,
      buff_cache_bytes: 4 * GIB,
      available_bytes: 12 * GIB,
    },
    swap: { total_bytes: 8 * GIB, used_bytes: 0, free_bytes: 8 * GIB },
  },
  system: {
    uptime_s: 7200,
    users: 1,
    cpu_threads: 8,
    load: { avg_1m: 1.5, avg_5m: 1, avg_15m: 0.5 },
  },
  disk: [
    {
      device: '/dev/nvme0n1p2',
      total_bytes: 100 * GIB,
      used_bytes: 45 * GIB,
      available_bytes: 55 * GIB,
      used_pct: 45,
      mount: '/',
    },
  ],
  processes: [
    { command: 'brave', count: 3, cpu_pct: 12.5, mem_pct: 8, rss_kb: 2048000, cpu_time_s: 90 },
  ],
};
