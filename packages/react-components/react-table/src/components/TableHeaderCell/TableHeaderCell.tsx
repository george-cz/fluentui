import * as React from 'react';
import { useTableHeaderCell_unstable } from './useTableHeaderCell';
import { renderTableHeaderCell_unstable } from './renderTableHeaderCell';
import { useTableHeaderCellStyles_unstable } from './useTableHeaderCellStyles';
import type { TableHeaderCellContextValue, TableHeaderCellProps, TableHeaderCellState } from './TableHeaderCell.types';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

// eslint-disable-next-line @typescript-eslint/naming-convention
const useTableHeaderCellContextValues_unstable = (state: TableHeaderCellState): TableHeaderCellContextValue => {
  const { columnId } = state;
  const context = React.useMemo(
    () => ({
      columnId,
    }),
    [columnId],
  );

  return context;
};

/**
 * TableHeaderCell component
 */
export const TableHeaderCell: ForwardRefComponent<TableHeaderCellProps> = React.forwardRef((props, ref) => {
  const state = useTableHeaderCell_unstable(props, ref);

  useTableHeaderCellStyles_unstable(state);
  return renderTableHeaderCell_unstable(state, useTableHeaderCellContextValues_unstable(state));
});

TableHeaderCell.displayName = 'TableHeaderCell';
