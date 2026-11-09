import type { ComponentProps, ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "cn";

export type ResponsiveTableColumn<T> = {
  id: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  headClassName?: string;
  cellClassName?: string;
  mobileClassName?: string;
  hideOnMobile?: boolean;
};

type ResponsiveDataTableProps<T> = {
  rows: T[];
  columns: ResponsiveTableColumn<T>[];
  getRowId: (row: T) => string;
  getRowProps?: (row: T) => Pick<ComponentProps<typeof TableRow>, "className"> & {
    "data-state"?: string;
  };
  renderMobileActions?: (row: T) => ReactNode;
  className?: string;
};

export function ResponsiveDataTable<T>({
  rows,
  columns,
  getRowId,
  getRowProps,
  renderMobileActions,
  className,
}: ResponsiveDataTableProps<T>) {
  const mobileColumns = columns.filter((column) => !column.hideOnMobile);

  return (
    <div className={cn("overflow-visible rounded-xl bg-transparent sm:overflow-hidden sm:border sm:bg-background", className)}>
      <div className="space-y-3 p-0 sm:hidden">
        {rows.map((row) => (
          <Card key={getRowId(row)} className="gap-0 pt-0 pb-0 shadow-none">
            <CardContent className="divide-y p-1">
              {mobileColumns.map((column) => (
                <div
                  key={column.id}
                  className={cn(
                    "grid min-h-14 grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 px-6 py-3",
                    column.mobileClassName,
                  )}
                >
                  <p className="text-sm text-muted-foreground">{column.header}</p>
                  <div className="min-w-0">{column.render(row)}</div>
                </div>
              ))}
            </CardContent>
            {renderMobileActions && (
              <CardFooter className="px-6 py-3 pb-5">
                {renderMobileActions(row)}
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <div className="hidden w-full overflow-x-auto sm:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.id} className={column.headClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={getRowId(row)} {...getRowProps?.(row)}>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.cellClassName}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
