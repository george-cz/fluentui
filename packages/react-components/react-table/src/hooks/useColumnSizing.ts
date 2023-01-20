import * as React from 'react';
import { ColumnResize } from './ColumnResize';
import {
  ColumnId,
  ColumnWidthProps,
  ColumnWidthState,
  TableColumnSizingOptions,
  TableColumnSizingState,
  TableState,
} from './types';
import { useColumnResizeState } from './useColumnResizeState';

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

function getColumnProps(column: ColumnWidthState): ColumnWidthProps {
  const width = column.width;
  return {
    columnId: column.columnId,
    style: {
      // native styles
      width,
      // non-native element styles (flex layout)
      minWidth: width,
      maxWidth: width,
    },
  };
}

function useColumnSizingState<TItem>(
  tableState: TableState<TItem>,
  options: TableColumnSizingOptions,
): TableState<TItem> {
  const { columns, tableRef } = tableState;

  const columnResizeState = useColumnResizeState<TItem>(columns);

  const manager = React.useState(() => new ColumnResize(columnResizeState, options))[0];

  React.useEffect(() => {
    if (tableRef.current) {
      manager.init(tableRef.current);
    }
  }, [manager, tableRef]);

  React.useEffect(() => {
    manager.updateState(columnResizeState);
  }, [columnResizeState, manager]);

  React.useEffect(() => {
    manager.updateOptions(options);
  }, [columnResizeState, manager, options]);

  return {
    ...tableState,
    columnSizing: {
      getOnMouseDown: (columnId: ColumnId) => manager.getOnMouseDown(columnId),
      getColumnWidth: (columnId: ColumnId) => columnResizeState.getColumnWidth(columnId),
      getTotalWidth: () => columnResizeState.getTotalWidth(),
      setColumnWidth: (columnId: ColumnId, newSize: number) => columnResizeState.setColumnWidth(columnId, newSize),
      getColumnWidths: () => columnResizeState.getColumns(),
      getColumnProps: (columnId: ColumnId) => {
        const col = columnResizeState.getColumnById(columnId);
        return col ? getColumnProps(col) : { columnId, style: { display: 'none' } };
      },
    },
  };
}
