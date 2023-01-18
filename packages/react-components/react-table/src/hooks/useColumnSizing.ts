import * as React from 'react';
import { ColumnResize, ColumnWidthOptions } from './ColumnResize';
import { ColumnId, TableColumnSizingOptions, TableColumnSizingState, TableState } from './types';
import { useColumnResizeState } from './useColumnResizeState';

// why are there 2 layout components for cells ? -> try to consolidate to one
// column collapse priority -> verify DetailsList
// window resizing
// click + drag resize
// change requirements without users changing code

export const defaultColumnSizingState: TableColumnSizingState = {
  getColumnWidth: () => 0,
  getColumnWidths: () => [],
  getOnMouseDown: () => () => null,
  getTotalWidth: () => 0,
  setColumnWidth: () => null,
  getColumnProps: () => ({ style: {}, columnId: '' }),
};

export function useColumnSizing<TItem>(options: TableColumnSizingOptions = {}) {
  // False positive, these plugin hooks are intended to be run on every render
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (tableState: TableState<TItem>) => useColumnSizingState(tableState, options);
}

function useColumnSizingState<TItem>(
  tableState: TableState<TItem>,
  options: TableColumnSizingOptions,
): TableState<TItem> {
  const { columns, tableRef } = tableState;

  const columnResizeState = useColumnResizeState<TItem>(columns);
  const colStatus = columnResizeState.getColumns();

  const forceUpdate = React.useReducer(() => ({}), {})[1];
  const manager = React.useState(() => new ColumnResize(columnResizeState, forceUpdate, options))[0];

  React.useEffect(() => {
    if (tableRef.current) {
      manager.init(tableRef.current);
    }
  }, [manager, tableRef]);

  React.useEffect(() => {
    manager.updateColumns(columns.map(({ columnId }) => ({ columnId })));
  }, [columns, manager]);

  React.useEffect(() => {
    console.log(columnResizeState.getColumns().map(c => c.width));
    manager.updateState(columnResizeState);
  }, [colStatus, manager]);

  React.useEffect(() => {
    manager.updateOptions(options);
  }, [manager, options]);

  return {
    ...tableState,
    columnSizing: {
      getOnMouseDown: (columnId: ColumnId) => manager.getOnMouseDown(columnId),
      getColumnWidth: (columnId: ColumnId) => manager.getColumnWidth(columnId),
      getTotalWidth: () => manager.totalWidth,
      setColumnWidth: (columnId: ColumnId, newSize: number) => manager.setColumnWidth(columnId, newSize),
      getColumnWidths: () => manager.columns,
      getColumnProps: (columnId: ColumnId) => manager.getColumnProps(columnId),
    },
  };
}
