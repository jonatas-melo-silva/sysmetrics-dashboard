import * as React from 'react';
import { cn } from '@/lib/utils';

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={cn('w-full text-sm tabular-nums', className)} {...props} />
    </div>
  );
}

const TableHeader = (props: React.ComponentProps<'thead'>) => <thead {...props} />;
const TableBody = (props: React.ComponentProps<'tbody'>) => <tbody {...props} />;

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return <tr className={cn('border-b border-border', className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'h-9 px-2 text-right font-medium text-muted-foreground first:text-left',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return <td className={cn('p-2 text-right first:text-left', className)} {...props} />;
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
