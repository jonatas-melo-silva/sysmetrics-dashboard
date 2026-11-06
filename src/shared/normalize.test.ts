import { describe, expect, it } from 'vitest';
import { normalize } from './normalize';

describe('normalize', () => {
  it('traduz as chaves em português para inglês, em qualquer profundidade', () => {
    const pt = {
      data_hora: 't',
      sistema: { tempo_ligado_s: 5, carga: { media_1m: 1 } },
      disco: [{ uso_pct: 45, montagem: '/' }],
      processos: [{ comando: 'brave', quantidade: 3 }],
    };
    expect(normalize(pt)).toEqual({
      timestamp: 't',
      system: { uptime_s: 5, load: { avg_1m: 1 } },
      disk: [{ used_pct: 45, mount: '/' }],
      processes: [{ command: 'brave', count: 3 }],
    });
  });

  it('leva usada_bytes e usado_bytes para a mesma chave', () => {
    expect(
      normalize({ memoria: { ram: { usada_bytes: 1 } }, disco: [{ usado_bytes: 2 }] }),
    ).toEqual({
      memory: { ram: { used_bytes: 1 } },
      disk: [{ used_bytes: 2 }],
    });
  });

  it('mantém chaves em inglês e nomes de chips de temperatura', () => {
    const en = { timestamp: 't', temperatures_c: { k10temp: { Tctl: 40 } } };
    expect(normalize(en)).toEqual(en);
  });

  it('devolve valores simples sem alterar', () => {
    expect(normalize(5)).toBe(5);
    expect(normalize(null)).toBeNull();
  });
});
