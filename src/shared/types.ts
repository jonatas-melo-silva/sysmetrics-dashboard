export interface ProcessGroup {
  command: string;
  count: number;
  cpu_pct: number;
  mem_pct: number;
  rss_kb: number;
  cpu_time_s: number;
}

export interface DiskUsage {
  device: string;
  total_bytes: number;
  used_bytes: number;
  available_bytes: number;
  used_pct: number;
  mount: string;
}

export interface Reading {
  timestamp: string;
  cpu: { mhz_max: number | null; mhz_min: number | null; mhz_current_avg: number | null };
  temperatures_c: Record<string, Record<string, number>>;
  memory: {
    ram: {
      total_bytes: number;
      used_bytes: number;
      free_bytes: number;
      shared_bytes: number;
      buff_cache_bytes: number;
      available_bytes: number;
    };
    swap: { total_bytes: number; used_bytes: number; free_bytes: number };
  };
  system: {
    uptime_s: number;
    users: number;
    cpu_threads: number;
    load: { avg_1m: number; avg_5m: number; avg_15m: number };
  };
  disk: DiskUsage[];
  processes: ProcessGroup[];
}
