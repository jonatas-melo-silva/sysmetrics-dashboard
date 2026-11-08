import { summarize } from '@/lib/metrics';
import type { Reading } from '@/shared/types';

export function StatStrip({ reading }: { reading: Reading }) {
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] border-t border-border">
      {summarize(reading).map(({ label, value }) => (
        <div key={label} className="border-b border-border py-3 pr-4">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="mt-0.5 text-xl font-medium tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
