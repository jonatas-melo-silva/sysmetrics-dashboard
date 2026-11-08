// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { reading } from '@/test/fixture';
import { ProcessTable } from './ProcessTable';

describe('ProcessTable', () => {
  it('mostra uma linha por comando com a contagem de processos', () => {
    render(<ProcessTable processes={reading.processes} />);
    expect(screen.getByRole('row', { name: /brave 3/ })).toBeInTheDocument();
  });
});
