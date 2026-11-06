import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { normalize } from '../src/shared/normalize';
import type { Reading } from '../src/shared/types';

const FILE = /^(?:system|sistema)_(\d{8})\.jsonl$/;
const PREFIXES = ['system', 'sistema'] as const;

export const DAY = /^\d{8}$/;

/** Dias com log (AAAAMMDD), do mais recente para o mais antigo, sem repetir. */
export async function listDays(dir: string): Promise<string[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }
  const days = new Set<string>();
  for (const name of names) {
    const match = FILE.exec(name);
    if (match?.[1]) days.add(match[1]);
  }
  return [...days].sort().reverse();
}

function isReading(value: unknown): value is Reading {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { timestamp?: unknown }).timestamp === 'string'
  );
}

/** Leituras do dia nos dois idiomas, com chaves em inglês e ordenadas por horário. */
export async function readDay(dir: string, day: string): Promise<Reading[]> {
  const readings: Reading[] = [];
  for (const prefix of PREFIXES) {
    let text: string;
    try {
      text = await readFile(path.join(dir, `${prefix}_${day}.jsonl`), 'utf8');
    } catch {
      continue;
    }
    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      try {
        const reading = normalize(JSON.parse(line));
        if (isReading(reading)) readings.push(reading);
      } catch {
        // linha corrompida: ignora e segue com o resto do arquivo
      }
    }
  }
  return readings.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
