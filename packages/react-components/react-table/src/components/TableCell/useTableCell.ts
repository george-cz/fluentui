import * as React from 'react';
import { getNativeElementProps, useMergedRefs } from '@fluentui/react-utilities';
import type { TableCellProps, TableCellState } from './TableCell.types';
import { useTableContext } from '../../contexts/tableContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Create the state required to render TableCell.
 *
 * The returned state can be modified with hooks such as useTableCellStyles_unstable,
 * before being passed to renderTableCell_unstable.
 *
 * @param props - props from this instance of TableCell
 * @param ref - reference to root HTMLElement of TableCell
 */
export const useTableCell_unstable = (props: TableCellProps, ref: React.Ref<HTMLElement>): TableCellState => {
  const { noNativeElements, size } = useTableContext();

  const rootComponent = props.as ?? noNativeElements ? 'div' : 'td';

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.columnId || '__unknown',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return {
    components: {
      root: rootComponent,
    },
    root: getNativeElementProps(rootComponent, {
      ref: useMergedRefs(ref, setNodeRef),
      role: rootComponent === 'div' ? 'cell' : undefined,
      ...props,
      // ...attributes,
      // ...listeners,
      style,
    }),
    noNativeElements,
    size,
  };
};
