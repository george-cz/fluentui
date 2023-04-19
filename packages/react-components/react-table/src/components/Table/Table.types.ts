import { SortableContextProps } from '@dnd-kit/sortable';
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';
import { ColumnReorderingTableProps } from '../../hooks/types';

export type TableSlots = {
  root: Slot<'table', 'div'>;
};

export type TableContextValue = {
  /**
   * Affects the sizes of all table subcomponents
   * @default medium
   */
  size: 'extra-small' | 'small' | 'medium';

  /**
   * Render all table elements as divs instead of semantic table elements
   * Using divs no longer uses `display: table` layout but `display: flex`
   * @default false
   */
  noNativeElements: boolean;

  /**
   * Whether the table is sortable
   * @default false
   */
  sortable: boolean;
};

export type SortDirection = 'ascending' | 'descending';

export type TableContextValues = {
  table: TableContextValue;
  dndContext: {};
  sortableContext: Partial<SortableContextProps>;
};

/**
 * Table Props
 */
export type TableProps = ComponentProps<TableSlots> & Partial<TableContextValue> & Partial<ColumnReorderingTableProps>;

/**
 * State used in rendering Table
 */
export type TableState = ComponentState<TableSlots> &
  Pick<Required<TableProps>, 'size' | 'noNativeElements'> &
  Partial<Pick<TableProps, 'onColumnDragEnd' | 'columns'>> &
  TableContextValue;
