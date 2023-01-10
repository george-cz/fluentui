import * as React from 'react';
import type { UseTableOptions, TableState, RowState, RowEnhancer, TableStatePlugin, TableSortState } from './types';
import { defaultTableSelectionState } from './useTableSelection';
import { defaultTableSortState } from './useTableSort';
import { defaultColumnSizingState } from './useColumnSizing';

const defaultRowEnhancer: RowEnhancer<unknown, RowState<unknown>> = row => row;

export const defaultTableState: TableState<unknown> = {
  selection: defaultTableSelectionState,
  sort: defaultTableSortState,
  getRows: () => [],
  getRowId: () => '',
  items: [],
  columns: [],
  columnSizing: defaultColumnSizingState,
  tableRef: React.createRef<HTMLDivElement>(),
};

export function useTableFeatures<TItem>(
  options: UseTableOptions<TItem>,
  plugins: TableStatePlugin[] = [],
): TableState<TItem> {
  const { items, getRowId, columns } = options;

  const getRows = <TRowState extends RowState<TItem>>(
    rowEnhancer = defaultRowEnhancer as RowEnhancer<TItem, TRowState>,
  ) => items.map((item, i) => rowEnhancer({ item, rowId: getRowId?.(item) ?? i }));

  const initialState: TableState<TItem> = {
    getRowId,
    items,
    columns,
    getRows,
    selection: defaultTableSelectionState,
    sort: defaultTableSortState as TableSortState<TItem>,
    columnSizing: defaultColumnSizingState,
    tableRef: React.useRef(null),
  };

  return plugins.reduce((state, plugin) => plugin(state), initialState);
}
