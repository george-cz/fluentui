import * as React from 'react';

import { TableHeaderCellSlots } from '../TableHeaderCell/TableHeaderCell.types';
import type { DataGridHeaderCellState } from './DataGridHeaderCell.types';
import { getSlots } from '@fluentui/react-utilities';
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-menu';
import { useDataGridContext_unstable } from '../../contexts/dataGridContext';
import { ColumnResizeState } from '../../hooks/types';
import { useTableColumnResizeKeyboardHandler } from '../../hooks/useTableColumnResizeKeyboardHandler';
import { useColumnIdContext } from '../../contexts/columnIdContext';

// const WithTableKeyboardHandler: React.FC<{
//   columnResizeState: ColumnResizeState;
//   children: (renderProps: {
//     keyboardHandler: ReturnType<typeof useTableColumnResizeKeyboardHandler>;
//   }) => React.ReactElement;
// }> = props => {
//   const { children } = props;
//   const keyboardHandler = useTableColumnResizeKeyboardHandler(props.columnResizeState);

//   return children({ keyboardHandler });
// };

/**
 * Render the final JSX of DataGridHeaderCell
 */
export const renderDataGridHeaderCell_unstable = (state: DataGridHeaderCellState) => {
  const { slots, slotProps } = getSlots<TableHeaderCellSlots>(state);
  // const columnSizing = useDataGridContext_unstable(ctx => ctx.columnSizing_unstable);
  // const columnId = useColumnIdContext();

  // const [open, setOpen] = React.useState(false);
  // const onOpenChange = (e: React.MouseEvent, data) => {
  //   console.log('onOpenChange', e, data);
  //   if (e.buttons) {
  //     return;
  //   }

  //   setOpen(data.open);
  //   return true;
  // };

  return (
    <slots.root {...slotProps.root}>
      <Menu openOnContext>
        <MenuTrigger>
          <slots.button {...slotProps.button}>
            {slotProps.root.children}
            {slots.sortIcon && <slots.sortIcon {...slotProps.sortIcon} />}
          </slots.button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <slots.resizeMenuItem {...slotProps.resizeMenuItem}>Keyboard Resize Mode</slots.resizeMenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      {slots.aside && <slots.aside {...slotProps.aside} />}
    </slots.root>
  );
};
