import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/lib/metrics';
import type { ProcessGroup } from '@/shared/types';

export function ProcessTable({ processes }: { processes: ProcessGroup[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Comando</TableHead>
          <TableHead>Processos</TableHead>
          <TableHead>CPU %</TableHead>
          <TableHead>Mem %</TableHead>
          <TableHead>RSS MiB</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {processes.map((p) => (
          <TableRow key={p.command}>
            <TableCell>{p.command}</TableCell>
            <TableCell>{p.count}</TableCell>
            <TableCell>{formatNumber(p.cpu_pct)}</TableCell>
            <TableCell>{formatNumber(p.mem_pct)}</TableCell>
            <TableCell>{formatNumber(p.rss_kb / 1024, 0)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
