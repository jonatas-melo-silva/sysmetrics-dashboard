import type { Reading } from '@/shared/types';

// No dev o Vite faz proxy de /api; na extensão o servidor local é chamado direto.
const BASE = import.meta.env.DEV ? '/api' : 'http://127.0.0.1:8765';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const fetchDays = () => get<string[]>('/days');
export const fetchDay = (day: string) => get<Reading[]>(`/day/${day}`);
