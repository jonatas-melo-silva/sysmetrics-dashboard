/** Chaves do sysmetrics_pt.sh e a chave equivalente do sysmetrics_en.sh. */
const PT_EN: Record<string, string> = {
  data_hora: 'timestamp',
  mhz_atual_media: 'mhz_current_avg',
  temperaturas_c: 'temperatures_c',
  memoria: 'memory',
  usada_bytes: 'used_bytes',
  livre_bytes: 'free_bytes',
  compartilhada_bytes: 'shared_bytes',
  disponivel_bytes: 'available_bytes',
  sistema: 'system',
  tempo_ligado_s: 'uptime_s',
  usuarios: 'users',
  threads_cpu: 'cpu_threads',
  carga: 'load',
  media_1m: 'avg_1m',
  media_5m: 'avg_5m',
  media_15m: 'avg_15m',
  disco: 'disk',
  dispositivo: 'device',
  usado_bytes: 'used_bytes',
  uso_pct: 'used_pct',
  montagem: 'mount',
  processos: 'processes',
  comando: 'command',
  quantidade: 'count',
  tempo_cpu_s: 'cpu_time_s',
};

/** Devolve o valor com todas as chaves em inglês, em qualquer profundidade. */
export function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [PT_EN[key] ?? key, normalize(v)]),
    );
  }
  return value;
}
