import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export interface Column<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  className?: string;
  width?: string;
}

export interface DataTableProps<T = unknown> {
  data: T[];
  columns: Column<T>[];

  // Selection
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T) => string;

  // Sorting
  sortable?: boolean;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;

  // Styling
  className?: string;
  emptyMessage?: string;
  maxHeight?: string;

  // Actions
  actions?: {
    render: (row: T, index: number) => React.ReactNode;
    width?: string;
  };
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  getRowId = (row) => row.id,
  sortable = false,
  sortKey,
  sortDirection,
  onSort,
  className = "",
  emptyMessage = "Nenhum item encontrado",
  maxHeight,
  actions
}: DataTableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      const allIds = data.map(getRowId);
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      onSelectionChange([...selectedIds, rowId]);
    } else {
      onSelectionChange(selectedIds.filter(id => id !== rowId));
    }
  };

  const handleSort = (columnKey: string) => {
    if (!onSort || !sortable) return;

    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortKey === columnKey && sortDirection === 'asc') {
      newDirection = 'desc';
    }

    onSort(columnKey, newDirection);
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="h-4 w-4" />;
    }

    return sortDirection === 'asc'
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const renderCellValue = (column: Column<T>, value: unknown, row: T, index: number) => {
    if (column.render) {
      return column.render(value, row, index);
    }

    // Default renderers for common types
    if (typeof value === 'boolean') {
      return <Badge variant={value ? "default" : "secondary"}>{value ? "Sim" : "Não"}</Badge>;
    }

    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    return String(value);
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const tableStyle = maxHeight ? { maxHeight, overflowY: 'auto' as const } : {};

  return (
    <div className={`border rounded-md ${className}`} style={tableStyle}>
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeSelected;
                  }}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
            )}

            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.className}
                style={column.width ? { width: column.width } : undefined}
              >
                {sortable && column.sortable !== false ? (
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    {renderSortIcon(column.key)}
                  </Button>
                ) : (
                  <span className="font-semibold">{column.label}</span>
                )}
              </TableHead>
            ))}

            {actions && (
              <TableHead
                className="text-center"
                style={actions.width ? { width: actions.width } : undefined}
              >
                Ações
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const rowId = getRowId(row);
              const isSelected = selectedIds.includes(rowId);

              return (
                <TableRow
                  key={rowId}
                  className={isSelected ? "bg-muted/50" : "hover:bg-muted/50"}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                        aria-label={`Selecionar item ${index + 1}`}
                      />
                    </TableCell>
                  )}

                  {columns.map((column) => {
                    const value = row[column.key];
                    return (
                      <TableCell key={column.key} className={column.className}>
                        {renderCellValue(column, value, row, index)}
                      </TableCell>
                    );
                  })}

                  {actions && (
                    <TableCell className="text-center">
                      {actions.render(row, index)}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Utility function to create columns easily
// eslint-disable-next-line react-refresh/only-export-components
export const createColumn = <T,>(
  key: keyof T,
  label: string,
  options: Partial<Column<T>> = {}
): Column<T> => ({
  key: String(key),
  label,
  ...options
});

// Common column renderers
// eslint-disable-next-line react-refresh/only-export-components
export const columnRenderers = {
  currency: (value: number) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  date: (value: string | Date) => {
    if (!value) return "-";
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString('pt-BR');
  },

  datetime: (value: string | Date) => {
    if (!value) return "-";
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleString('pt-BR');
  },

  badge: (value: string, variant: "default" | "secondary" | "destructive" | "outline" = "default") => (
    <Badge variant={variant}>{value}</Badge>
  ),

  truncate: (value: string, maxLength: number = 50) => {
    if (!value) return "-";
    if (value.length <= maxLength) return value;
    return `${value.substring(0, maxLength)}...`;
  }
};