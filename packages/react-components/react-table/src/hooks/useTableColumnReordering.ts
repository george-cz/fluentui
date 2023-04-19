import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import * as React from 'react';
import { TableColumnId, TableColumnReorderingState, TableFeaturesState, UseTableColumnReorderingParams } from './types';

export const defaultColumnReorderingState: TableColumnReorderingState = {
  getTableHeaderCellProps: () => ({}),
  getTableProps: () => ({}),
};

export function useTableColumnReordering_unstable<TItem>(params: UseTableColumnReorderingParams<TItem>) {
  // False positive, these plugin hooks are intended to be run on every render
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (tableState: TableFeaturesState<TItem>) => useTableColumnReorderingState(tableState, params);
}

function useTableColumnReorderingState<TItem>(
  tableState: TableFeaturesState<TItem>,
  params: UseTableColumnReorderingParams<TItem>,
): TableFeaturesState<TItem> {
  // const state = useTableColumnReorderingDNDState(tableState.columns, params.onColumnOrderChange, params.preview);
  const [localColumns, setLocalColumns] = React.useState(tableState.columns);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalColumns(columns => {
        const oldIndex = columns.findIndex(col => col.columnId === active.id);
        const newIndex = columns.findIndex(col => col.columnId === over.id);

        return arrayMove(columns, oldIndex, newIndex);
      });
    }
  }

  return {
    ...tableState,
    columns: localColumns,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    columnReordering_unstable: {
      getTableHeaderCellProps: (columnId: TableColumnId) => ({
        columnId,
      }),
      getTableProps: () => ({
        columns: localColumns.map(column => column.columnId),
        onColumnDragEnd: onDragEnd,
      }),
    },
  };
}
