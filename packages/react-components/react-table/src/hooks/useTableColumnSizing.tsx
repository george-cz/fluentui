import * as React from 'react';
import { TableResizeHandle } from '../TableResizeHandle';
import {
  ColumnResizeState,
  ColumnWidthState,
  TableColumnId,
  TableColumnSizingState,
  TableFeaturesState,
  UseTableColumnSizingParams,
} from './types';
import { useMeasureElement } from './useMeasureElement';
import { useTableColumnResizeKeyboardHandler } from './useTableColumnResizeKeyboardHandler';
import { useTableColumnResizeMouseHandler } from './useTableColumnResizeMouseHandler';
import { useTableColumnResizeState } from './useTableColumnResizeState';
import { MenuItem } from '../../../react-menu/src/MenuItem';
import { useKeyboardNavigationContext } from '../contexts/keyboardNavigationContext';
import { WithColumnId } from '../contexts/columnIdContext';
import { useEventCallback } from '@fluentui/react-utilities';

export const defaultColumnSizingState: TableColumnSizingState = {
  getColumnWidths: () => [],
  getOnMouseDown: () => () => null,
  setColumnWidth: () => null,
  getTableHeaderCellProps: () => ({ style: {}, columnId: '' }),
  getTableCellProps: () => ({ style: {}, columnId: '' }),
};

export function useTableColumnSizing_unstable<TItem>(params?: UseTableColumnSizingParams) {
  // False positive, these plugin hooks are intended to be run on every render
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (tableState: TableFeaturesState<TItem>) => useTableColumnSizingState(tableState, params);
}

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

function useInteractiveMode(columnResizeState: ColumnResizeState) {
  const DECREASE_WIDTH = 'ArrowLeft';
  const INCREASE_WIDTH = 'ArrowRight';
  const SPACEBAR = ' ';
  const ENTER = 'Enter';
  const ESC = 'Escape';

  const STEP = 20;
  const PRECISION_MODIFIER = 'Shift';
  const PRECISION_FACTOR = 1 / 4;

  const { setNavigationGroupParams, defaultNavigationGroupParams } = useKeyboardNavigationContext();
  const columnId = React.useRef<TableColumnId>();

  const columnResizeStateRef = React.useRef<ColumnResizeState>(columnResizeState);
  React.useEffect(() => {
    columnResizeStateRef.current = columnResizeState;
  }, [columnResizeState]);

  const keyboardHandler = useEventCallback((event: KeyboardEvent) => {
    if (!columnId.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const colId = columnId.current;

    if (!colId) {
      return;
    }

    const width = columnResizeStateRef.current.getColumnWidth(colId);
    const precisionModifier = event.getModifierState(PRECISION_MODIFIER);

    switch (event.key) {
      case DECREASE_WIDTH:
        columnResizeStateRef.current.setColumnWidth(event, {
          columnId: colId,
          width: width - (precisionModifier ? STEP * PRECISION_FACTOR : STEP),
        });
        return;

      case INCREASE_WIDTH:
        columnResizeStateRef.current.setColumnWidth(event, {
          columnId: colId,
          width: width + (precisionModifier ? STEP * PRECISION_FACTOR : STEP),
        });
        return;

      case SPACEBAR:
      case ENTER:
      case ESC:
        if (columnId.current) {
          disableInteractiveMode();
        }
        break;
    }
  });

  const enableInteractiveMode = React.useCallback(
    (colId: TableColumnId) => {
      columnId.current = colId;

      window.addEventListener('keydown', keyboardHandler);

      setNavigationGroupParams({
        ...defaultNavigationGroupParams,
        ignoreDefaultKeydown: {
          ArrowLeft: true,
          ArrowRight: true,
        },
      });
    },
    [defaultNavigationGroupParams, keyboardHandler, setNavigationGroupParams],
  );

  const disableInteractiveMode = React.useCallback(() => {
    columnId.current = undefined;
    window.removeEventListener('keydown', keyboardHandler);
    setNavigationGroupParams(defaultNavigationGroupParams);
  }, [defaultNavigationGroupParams, keyboardHandler, setNavigationGroupParams]);

  const enterInteractiveMode = (colId: TableColumnId) => {
    if (!columnId.current) {
      enableInteractiveMode(colId);
    }
  };

  return {
    enterInteractiveMode,
  };
}

function getColumnStyles(column: ColumnWidthState): React.CSSProperties {
  const width = column.width;

  return {
    // native styles
    width,
    // non-native element styles (flex layout)
    minWidth: width,
    maxWidth: width,
  };
}

function useTableColumnSizingState<TItem>(
  tableState: TableFeaturesState<TItem>,
  params?: UseTableColumnSizingParams,
): TableFeaturesState<TItem> {
  const { columns } = tableState;

  // Gets the container width
  const { width, measureElementRef } = useMeasureElement();
  // Creates the state based on columns and available containerWidth
  const columnResizeState = useTableColumnResizeState(columns, width + (params?.containerWidthOffset || 0), params);
  // Creates the mouse handler and attaches the state to it
  const mouseHandler = useTableColumnResizeMouseHandler(columnResizeState);

  const interactiveMode = useInteractiveMode(columnResizeState);

  const onMenuItemClick = (columnId: TableColumnId) => e => {
    e.preventDefault();
    e.stopPropagation();
    interactiveMode.enterInteractiveMode(columnId);
  };

  tableState.accessibilityMenuOptions?.push(
    <WithColumnId>
      {(columnId: TableColumnId) => <MenuItem onClick={onMenuItemClick(columnId)}>Column Resizing</MenuItem>}
    </WithColumnId>,
  );

  return {
    ...tableState,
    tableRef: measureElementRef,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    columnSizing_unstable: {
      getOnMouseDown: mouseHandler.getOnMouseDown,
      setColumnWidth: (columnId: TableColumnId, w: number) =>
        columnResizeState.setColumnWidth(undefined, { columnId, width: w }),
      getColumnWidths: columnResizeState.getColumns,
      getTableHeaderCellProps: (columnId: TableColumnId) => {
        const col = columnResizeState.getColumnById(columnId);

        const aside = (
          <TableResizeHandle
            onMouseDown={mouseHandler.getOnMouseDown(columnId)}
            onTouchStart={mouseHandler.getOnMouseDown(columnId)}
            // onKeyDown={keyboardHandler.getOnKeyDown(columnId)}
            // onClick={keyboardHandler.getOnClick(columnId)}
            // onBlur={keyboardHandler.getOnBlur()}
            value={col ? col.width : 0}
          />
        );
        return col ? { style: getColumnStyles(col), aside, columnId } : { columnId };
      },
      getTableCellProps: (columnId: TableColumnId) => {
        const col = columnResizeState.getColumnById(columnId);
        return col ? { style: getColumnStyles(col) } : {};
      },
    },
  };
}
