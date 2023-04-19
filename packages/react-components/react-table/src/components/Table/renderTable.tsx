/** @jsxRuntime classic */
/** @jsx createElement */

import { createElement } from '@fluentui/react-jsx-runtime';
import { getSlotsNext } from '@fluentui/react-utilities';
import type { TableState, TableSlots, TableContextValues } from './Table.types';
import { TableContextProvider } from '../../contexts/tableContext';

import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

/**
 * Render the final JSX of Table
 */
export const renderTable_unstable = (state: TableState, contextValues: TableContextValues) => {
  const { slots, slotProps } = getSlotsNext<TableSlots>(state);

  return (
    <DndContext {...contextValues.dndContext}>
      <SortableContext {...contextValues.sortableContext}>
        <TableContextProvider value={contextValues.table}>
          <slots.root {...slotProps.root} />
        </TableContextProvider>
      </SortableContext>
    </DndContext>
  );
};
