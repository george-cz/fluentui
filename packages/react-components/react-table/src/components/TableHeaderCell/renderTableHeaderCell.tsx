import * as React from 'react';
import { getSlots } from '@fluentui/react-utilities';
import { TableHeaderCellState, TableHeaderCellSlots, TableHeaderCellContextValue } from './TableHeaderCell.types';
import { Menu, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-menu';
import { useTableContext } from '../../contexts/tableContext';
import { ColumnIdContextProvider } from '../../contexts/columnIdContext';

/**
 * Render the final JSX of TableHeaderCell
 */
export const renderTableHeaderCell_unstable = (
  state: TableHeaderCellState,
  contextValues: TableHeaderCellContextValue,
) => {
  const { slots, slotProps } = getSlots<TableHeaderCellSlots>(state);

  const hasAccessibilityMenu = React.Children.count(slotProps.accessibilityMenu.children);

  const button = hasAccessibilityMenu ? (
    <Menu openOnContext>
      <MenuTrigger>
        <slots.button {...slotProps.button}>
          {slotProps.root.children}
          {slots.sortIcon && <slots.sortIcon {...slotProps.sortIcon} />}
        </slots.button>
      </MenuTrigger>
      <MenuPopover>
        <slots.accessibilityMenu {...slotProps.accessibilityMenu} />
      </MenuPopover>
    </Menu>
  ) : (
    <slots.button {...slotProps.button}>
      {slotProps.root.children}
      {slots.sortIcon && <slots.sortIcon {...slotProps.sortIcon} />}
    </slots.button>
  );

  return (
    <ColumnIdContextProvider key={contextValues.columnId} value={contextValues.columnId}>
      <slots.root {...slotProps.root}>
        {button}
        {slots.aside && <slots.aside {...slotProps.aside} />}
      </slots.root>
    </ColumnIdContextProvider>
  );
};
