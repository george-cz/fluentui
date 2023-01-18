import { useState } from 'react';
import { ColumnDefinition, ColumnId, ColumnResizeState, ColumnWidthState } from './types';

const DEFAULT_WIDTH = 450;
const DEFAULT_MIN_WIDTH = 110;

function columnDefinitionsToState<T>(columns: ColumnDefinition<T>[]): ColumnWidthState[] {
  return columns.map(column => {
    const { columnId } = column;
    return {
      columnId,
      width: DEFAULT_MIN_WIDTH,
      minWidth: DEFAULT_MIN_WIDTH,
      idealWidth: DEFAULT_WIDTH,
      padding: 16,
    };
  });
}

const getColumnById = (state: ColumnWidthState[], columnId: ColumnId) => {
  const column = state.find(c => c.columnId === columnId);
  if (!column) {
    throw new Error(`Couldn't find column ${columnId}.`);
  }
  return column;
};

function getColumnByIndex(state: ColumnWidthState[], index: number) {
  return state[index];
}

function getTotalWidth(state: ColumnWidthState[]): number {
  return state.reduce((sum, column) => sum + column.width + column.padding, 0);
}

const getLastColumn = (state: ColumnWidthState[]) => {
  return state[state.length - 1];
};

function getLength(state: ColumnWidthState[]) {
  return state.length;
}

function getColumnWidth(state: ColumnWidthState[], columnId: ColumnId): number {
  const column = getColumnById(state, columnId);
  if (!column) {
    throw new Error(`Column ${columnId} does not exist`);
  }
  return column.width;
}

const setColumnProperty = (
  localState: ColumnWidthState[],
  columnId: ColumnId,
  property: keyof ColumnWidthState,
  value: number,
) => {
  const currentColumn = getColumnById(localState, columnId);

  if (currentColumn[property] === value) {
    return localState;
  }

  const updatedColumn = { ...getColumnById(localState, columnId), [property]: value };

  const newState = localState.reduce((acc, current) => {
    if (current.columnId === updatedColumn.columnId) {
      return [...acc, updatedColumn];
    }
    return [...acc, current];
  }, [] as ColumnWidthState[]);

  return newState;
};

export function useColumnResizeState<T>(columns: ColumnDefinition<T>[]): ColumnResizeState {
  const [state, setState] = useState<ColumnWidthState[]>(columnDefinitionsToState(columns));

  const setColumnWidth = (columnId: ColumnId, width: number, availableWidth: number) => {
    const column = getColumnById(state, columnId);
    let newState = [...state];

    // Return early if the new width should result in smaller than minimum
    if (width < column.minWidth) {
      return;
    }

    // Adjust the column width and measure the new total width
    newState = setColumnProperty(newState, columnId, 'width', width);
    const newTotalWidth = getTotalWidth(newState);

    // The new width overflows the container, adjust other columns accordingly
    if (newTotalWidth > availableWidth) {
      let overflowsBy = newTotalWidth - availableWidth;

      let i = newState.length - 1;
      while (i >= 0 && overflowsBy > 0) {
        const currentCol = getColumnByIndex(newState, i);
        if (currentCol.width > currentCol.minWidth) {
          const colAdjustment = Math.min(currentCol.width - currentCol.minWidth, overflowsBy);
          overflowsBy -= colAdjustment;
          newState = setColumnProperty(newState, currentCol.columnId, 'width', currentCol.width - colAdjustment);
        }
        i--;
      }
    }
    // The resulting width is smaller than available width, adjust the last column to take it up
    else {
      const lastCol = getLastColumn(newState);
      const difference = availableWidth - newTotalWidth;
      if (difference > 0) {
        newState = setColumnProperty(newState, lastCol.columnId, 'width', lastCol.width + difference);
      }
    }

    setState(newState);
  };

  const resetLayout = (containerWidth: number) => {
    let widthToFill = containerWidth;
    let newState = [...state];

    // first pass, set columns to min
    let i = 0;
    while (i < newState.length) {
      const column = newState[i];
      newState = setColumnProperty(newState, column.columnId, 'width', column.minWidth);
      widthToFill = containerWidth - getTotalWidth(newState);
      i++;
    }

    // second pass, set columns to ideal width
    i = 0;
    while (i < newState.length) {
      const column = newState[i];
      if (widthToFill > column.idealWidth + column.padding) {
        newState = setColumnProperty(newState, column.columnId, 'width', column.idealWidth);
        widthToFill = containerWidth - getTotalWidth(newState);
      }
      i++;
    }

    // last columns gets the rest
    if (widthToFill > 0) {
      const column = getLastColumn(newState);
      const { width } = column;
      newState = setColumnProperty(newState, column.columnId, 'width', width + widthToFill);
    }

    setState(newState);
  };

  const setColumnIdealWidth = (columnId: ColumnId, minWidth: number) => {
    setState(setColumnProperty(state, columnId, 'idealWidth', minWidth));
  };

  function getColumns() {
    return state;
  }

  return {
    getColumnById: (colId: ColumnId) => getColumnById(state, colId),
    getColumnByIndex: (index: number) => getColumnByIndex(state, index),
    getColumns,
    getColumnWidth: (colId: ColumnId) => getColumnWidth(state, colId),
    getLastColumn: () => getLastColumn(state),
    getLength: () => getLength(state),
    getTotalWidth: () => getTotalWidth(state),
    setColumnIdealWidth,
    setColumnWidth,
    resetLayout,
  };
}
