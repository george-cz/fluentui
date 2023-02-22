import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';
import { ARIAButtonSlotProps } from '@fluentui/react-aria';
import { SortDirection, TableContextValue } from '../Table/Table.types';
import { MenuList } from '@fluentui/react-menu';
import { TableColumnId } from '../../hooks/types';

export type TableHeaderCellSlots = {
  root: Slot<'th', 'div'>;

  sortIcon: Slot<'span'>;

  /**
   * Button handles correct narration and interactions for sorting;
   */
  button: NonNullable<Slot<ARIAButtonSlotProps>>;
  /**
   * aside content for anything that should be after main content of the table header cell
   */
  aside: Slot<'span'>;

  /**
   * Accessibility menu for keyboard navigation
   */
  accessibilityMenu: Slot<typeof MenuList>;
};

/**
 * TableHeaderCell Props
 */
export type TableHeaderCellProps = ComponentProps<Partial<TableHeaderCellSlots>> & {
  /**
   * @default undefined
   */
  sortDirection?: SortDirection;

  columnId?: TableColumnId;
};

export type TableHeaderCellContextValue = {
  columnId?: TableColumnId;
};

/**
 * State used in rendering TableHeaderCell
 */
export type TableHeaderCellState = ComponentState<TableHeaderCellSlots> &
  Pick<TableContextValue, 'noNativeElements' | 'sortable'> &
  TableHeaderCellContextValue;
