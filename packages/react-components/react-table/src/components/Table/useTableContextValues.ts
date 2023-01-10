import * as React from 'react';
import { TableContextValues, TableState } from './Table.types';

export function useTableContextValues_unstable(state: TableState): TableContextValues {
  const { size, noNativeElements, sortable, columnWidths } = state;

  const tableContext = React.useMemo(
    () => ({
      noNativeElements,
      size,
      sortable,
      columnWidths,
    }),
    [noNativeElements, size, sortable, columnWidths],
  );

  return {
    table: tableContext,
  };
}
