import * as React from 'react';
import { useEventCallback } from '@fluentui/react-utilities';
import type { DataGridHeaderCellProps, DataGridHeaderCellState } from './DataGridHeaderCell.types';
import { useTableHeaderCell_unstable } from '../TableHeaderCell/useTableHeaderCell';
import { useDataGridContext_unstable } from '../../contexts/dataGridContext';
import { useColumnIdContext } from '../../contexts/columnIdContext';
import { useTableContext } from '../../contexts/tableContext';
import { MenuItem } from '@fluentui/react-menu';
import { useKeyboardNavigationContext } from '../../contexts/keyboardNavigationContext';
import { ColumnResizeState, TableColumnId, TableColumnSizingState } from '../../hooks/types';

function useInteractiveMode(columnResizeState: TableColumnSizingState) {
  const DECREASE_WIDTH = 'ArrowLeft';
  const INCREASE_WIDTH = 'ArrowRight';
  const SPACEBAR = ' ';
  const ENTER = 'Enter';
  const ESC = 'Escape';

  const STEP = 20;
  const PRECISION_MODIFIER = 'Shift';
  const PRECISION_FACTOR = 1 / 4;

  const { setNavigationGroupParams, defaultNavigationGroupParams } = useKeyboardNavigationContext();
  const [interactiveMode, setInteractiveMode] = React.useState(false);

  const enableInteractiveMode = React.useCallback(() => {
    setInteractiveMode(true);
    setNavigationGroupParams({
      ...defaultNavigationGroupParams,
      ignoreDefaultKeydown: {
        ArrowLeft: true,
        ArrowRight: true,
      },
    });
  }, [defaultNavigationGroupParams, setNavigationGroupParams]);

  const disableInteractiveMode = React.useCallback(() => {
    setInteractiveMode(false);
    setNavigationGroupParams(defaultNavigationGroupParams);
  }, [defaultNavigationGroupParams, setNavigationGroupParams]);

  /**
   * Handles keyboard events. Doesn't cover entering interactive mode with the VoiceOver, see clickHandler
   */
  const keyboardHandler = (columnId: TableColumnId) => (event: KeyboardEvent) => {
    if (!interactiveMode) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (!columnId) {
      return;
    }

    const width = columnResizeState.getColumnWidths().find(c => c.columnId === columnId)?.width || 0;
    const precisionModifier = event.getModifierState(PRECISION_MODIFIER);

    switch (event.key) {
      case DECREASE_WIDTH:
        columnResizeState.setColumnWidth(columnId, width - (precisionModifier ? STEP * PRECISION_FACTOR : STEP));
        return;

      case INCREASE_WIDTH:
        columnResizeState.setColumnWidth(columnId, width + (precisionModifier ? STEP * PRECISION_FACTOR : STEP));
        return;

      case SPACEBAR:
      case ENTER:
      case ESC:
        if (interactiveMode) {
          disableInteractiveMode();
        }
        break;
    }
  };

  const enterInteractiveMode = (colId: TableColumnId) => {
    if (!interactiveMode) {
      enableInteractiveMode();
    }
  };

  const onBlur = (event: React.FocusEvent) => {
    disableInteractiveMode();
  };

  return {
    getOnKeyDown: (columnId: TableColumnId) => keyboardHandler(columnId),
    // getOnClick: (columnId: TableColumnId) => clickHandler(columnId),
    getOnBlur: () => onBlur,
    enterInteractiveMode,
  };
}

/**
 * Create the state required to render DataGridHeaderCell.
 *
 * The returned state can be modified with hooks such as useDataGridHeaderCellStyles_unstable,
 * before being passed to renderDataGridHeaderCell_unstable.
 *
 * @param props - props from this instance of DataGridHeaderCell
 * @param ref - reference to root HTMLElement of DataGridHeaderCell
 */
export const useDataGridHeaderCell_unstable = (
  props: DataGridHeaderCellProps,
  ref: React.Ref<HTMLElement>,
): DataGridHeaderCellState => {
  const columnId = useColumnIdContext();
  const { sortable } = useTableContext();
  const toggleColumnSort = useDataGridContext_unstable(ctx => ctx.sort.toggleColumnSort);
  const sortDirection = useDataGridContext_unstable(ctx =>
    sortable ? ctx.sort.getSortDirection(columnId) : undefined,
  );

  const resizableColumns = useDataGridContext_unstable(ctx => ctx.resizableColumns);
  const columnSizing = useDataGridContext_unstable(ctx => ctx).columnSizing_unstable;

  const interactiveMode = useInteractiveMode(columnSizing);

  const onClick = useEventCallback((e: React.MouseEvent<HTMLTableHeaderCellElement>) => {
    if (sortable) {
      toggleColumnSort(e, columnId);
    }
    props.onClick?.(e);
  });

  const tableHeaderCellState = useTableHeaderCell_unstable(
    {
      sortDirection,
      as: 'div',
      tabIndex: sortable ? undefined : 0,
      ...(resizableColumns ? columnSizing.getTableHeaderCellProps(columnId) : {}),
      ...props,
      onClick,
    },
    ref,
  );

  tableHeaderCellState.components.resizeMenuItem = MenuItem;

  tableHeaderCellState.root = {
    ...tableHeaderCellState.root,
    onKeyDown: interactiveMode.getOnKeyDown(columnId),
    // onClick: interactiveMode.getOnClick(columnId),
    onBlur: interactiveMode.getOnBlur(),
  };
  tableHeaderCellState.resizeMenuItem = {
    onClick: e => {
      interactiveMode.enterInteractiveMode(columnId);
      e.preventDefault();
      e.stopPropagation();
    },
  };

  return tableHeaderCellState;
};
