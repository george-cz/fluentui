import * as React from 'react';
import { TableContextValues, TableState } from './Table.types';

export function useTableContextValues_unstable(state: TableState): TableContextValues {
  const { size, noNativeElements, sortable, accessibilityMenuOptions } = state;

  const tableContext = React.useMemo(
    () => ({
      noNativeElements,
      size,
      sortable,
      accessibilityMenuOptions,
    }),
    [noNativeElements, size, sortable, accessibilityMenuOptions],
  );

  return {
    table: tableContext,
  };
}
