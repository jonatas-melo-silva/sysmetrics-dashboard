import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { listDays, readDay } from './logs';

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), 'sysmetrics-'));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

const line = (o: object) => JSON.stringify(o) + '\n';
const file = (name: string, content = '') => writeFile(path.join(dir, name), content);

describe('listDays', () => {
  it('lista os dias dos dois idiomas, do mais recente ao mais antigo, sem repetir', async () => {
    for (const name of [
      'system_20261104.jsonl',
      'sistema_20261105.jsonl',
      'system_20261105.jsonl',
      'notas.txt',
      'system_2026.jsonl',
    ]) {
      await file(name);
    }
    expect(await listDays(dir)).toEqual(['20261105', '20261104']);
  });

  it('devolve lista vazia quando a pasta não existe', async () => {
    expect(await listDays(path.join(dir, 'nada'))).toEqual([]);
  });
});

describe('readDay', () => {
  it('junta os dois idiomas, normaliza as chaves e ordena por horário', async () => {
    await file(
      'system_20261105.jsonl',
      line({ timestamp: '2026-11-05T09:10:00-03:00' }) +
        line({ timestamp: '2026-11-05T09:00:00-03:00' }),
    );
    await file('sistema_20261105.jsonl', line({ data_hora: '2026-11-05T09:05:00-03:00' }));
    const readings = await readDay(dir, '20261105');
    expect(readings.map((r) => r.timestamp.slice(11, 16))).toEqual(['09:00', '09:05', '09:10']);
  });

  it('ignora linhas corrompidas e valores que não são leituras', async () => {
    await file(
      'system_20261105.jsonl',
      'lixo\n5\n' + line({ timestamp: '2026-11-05T09:00:00-03:00' }) + '{"corte',
    );
    expect(await readDay(dir, '20261105')).toHaveLength(1);
  });

  it('devolve lista vazia para um dia sem arquivo', async () => {
    expect(await readDay(dir, '20200101')).toEqual([]);
  });
});
