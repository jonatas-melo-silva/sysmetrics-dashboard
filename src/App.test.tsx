// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { reading } from '@/test/fixture';
import App from './App';

const ok = (body: unknown) => ({ ok: true, json: async () => body });

afterEach(() => vi.unstubAllGlobals());

describe('App', () => {
  it('carrega o dia mais recente e mostra a última leitura', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ok(url.endsWith('/days') ? ['20261105'] : [reading])),
    );
    render(<App />);
    expect(await screen.findByText('Processos mais ativos na última coleta')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('20261105');
    expect(screen.getByText('k10temp Tctl')).toBeInTheDocument();
  });

  it('avisa quando o servidor local não responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    render(<App />);
    expect(await screen.findByText(/não respondeu em 127\.0\.0\.1:8765/)).toBeInTheDocument();
  });
});
