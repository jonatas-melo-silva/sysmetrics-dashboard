import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { request, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app';

let server: Server;
let port: number;
let dir: string;

beforeAll(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), 'sysmetrics-'));
  await writeFile(
    path.join(dir, 'system_20261105.jsonl'),
    JSON.stringify({ timestamp: '2026-11-05T09:00:00-03:00' }) + '\n',
  );
  server = createApp(dir);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  port = (server.address() as AddressInfo).port;
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(dir, { recursive: true, force: true });
});

function call(
  urlPath: string,
  options: { method?: string; headers?: Record<string, string> } = {},
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        host: '127.0.0.1',
        port,
        path: urlPath,
        method: options.method ?? 'GET',
        headers: options.headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
      },
    );
    req.on('error', reject);
    req.end();
  });
}

describe('servidor', () => {
  it('GET /days devolve os dias com log', async () => {
    const res = await call('/days');
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toEqual(['20261105']);
  });

  it('GET /day/AAAAMMDD devolve as leituras do dia', async () => {
    const res = await call('/day/20261105');
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toHaveLength(1);
  });

  it('recusa Host diferente de 127.0.0.1 e localhost', async () => {
    expect((await call('/days', { headers: { Host: 'evil.com' } })).status).toBe(403);
  });

  it('recusa métodos que não sejam GET', async () => {
    expect((await call('/days', { method: 'POST' })).status).toBe(405);
  });

  it('não sai da pasta de logs nem aceita dia fora do formato', async () => {
    expect((await call('/day/../../etc/passwd')).status).toBe(404);
    expect((await call('/day/abc')).status).toBe(404);
  });
});
