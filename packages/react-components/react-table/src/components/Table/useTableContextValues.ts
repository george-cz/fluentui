import { closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { horizontalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import * as React from 'react';
import { TableContextValues, TableState } from './Table.types';

export function useTableContextValues_unstable(state: TableState): TableContextValues {
  const { size, noNativeElements, sortable, onColumnDragEnd, columns } = state;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const tableContext = React.useMemo(
    () => ({
      noNativeElements,
      size,
      sortable,
    }),
    [noNativeElements, size, sortable],
  );

  return {
    table: tableContext,
    dndContext: {
      sensors,
      onDragEnd: onColumnDragEnd,
      collisionDetection: closestCenter,
    },
    sortableContext: {
      items: columns || [],
      strategy: horizontalListSortingStrategy,
    },
  };
}
