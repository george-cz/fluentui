import * as React from 'react';
import {
  TableColumnId,
  ColumnWidthState,
  TableColumnSizingState,
  TableFeaturesState,
  UseColumnSizingParams,
} from './types';
import { useColumnResizeState } from './useColumnResizeState';
import useColumnResizeMouseHandler from './useColumnResizeMouseHandler';
import { useMeasureElement } from './useMeasureElement';
import { TableResizeHandle } from '../TableResizeHandle';

export const defaultColumnSizingState: TableColumnSizingState = {
  getColumnWidth: () => 0,
  getColumnWidths: () => [],
  getOnMouseDown: () => () => null,
  getTotalWidth: () => 0,
  setColumnWidth: () => null,
  getColumnProps: () => ({ style: {}, columnId: '' }),
};

export function useColumnSizing_unstable<TItem>(params?: UseColumnSizingParams) {
  // False positive, these plugin hooks are intended to be run on every render
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (tableState: TableFeaturesState<TItem>) => useColumnSizingState(tableState, params);
}

function getColumnStyles(column: ColumnWidthState): React.CSSProperties {
  const width = column.width;

  return {
    // native styles
    width,
    // non-native element styles (flex layout)
    minWidth: width,
    maxWidth: width,
  };
}

function useColumnSizingState<TItem>(
  tableState: TableFeaturesState<TItem>,
  params?: UseColumnSizingParams,
): TableFeaturesState<TItem> {
  const { columns } = tableState;

  // Gets the container width
  const { width, measureElementRef } = useMeasureElement();
  // Creates the state based on columns and available containerWidth
  const columnResizeState = useColumnResizeState<TItem>(columns, width, params);
  // Creates the mouse handler and attaches the state to it
  const mouseHandler = useColumnResizeMouseHandler(columnResizeState);

  return {
    ...tableState,
    tableRef: measureElementRef,
    columnSizing: {
      getOnMouseDown: (columnId: TableColumnId) => mouseHandler.getOnMouseDown(columnId),
      getColumnWidth: (columnId: TableColumnId) => columnResizeState.getColumnWidth(columnId),
      getTotalWidth: () => columnResizeState.getTotalWidth(),
      setColumnWidth: (columnId: TableColumnId, newSize: number) => columnResizeState.setColumnWidth(columnId, newSize),
      getColumnWidths: () => columnResizeState.getColumns(),
      getColumnProps: (columnId: TableColumnId) => {
        const col = columnResizeState.getColumnById(columnId);
        const aside = <TableResizeHandle onMouseDown={mouseHandler.getOnMouseDown(columnId)} />;
        return col ? { style: getColumnStyles(col), aside } : {};
      },
    },
  };
}
