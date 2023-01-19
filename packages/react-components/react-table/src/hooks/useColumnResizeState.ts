import { useEffect, useState } from 'react';
import { ColumnDefinition, ColumnId, ColumnResizeState, ColumnWidthState } from './types';

const DEFAULT_WIDTH = 150;
const DEFAULT_MIN_WIDTH = 100;

/**
 * This function takes the column definitions and the curent ColumnWidthState and returns new state.
 *  - It uses existing state for existing columns.
 *  - It removes any state for columns no longer present.
 *  - It checks if any column has been replaced and returns updated state if so
 *  - It returns old state if no changes in the state have been made (so that react doesn't call effects)
 * @param columns
 * @param state
 * @returns
 */

function columnDefinitionsToState<T>(
  columns: ColumnDefinition<T>[],
  state: ColumnWidthState[] = [],
): ColumnWidthState[] {
  let updated = false;

  const updatedState = columns.map(column => {
    const { columnId } = column;
    const existingColumnState = state.find(col => col.columnId === column.columnId);

    if (existingColumnState) {
      return existingColumnState;
    }

    updated = true;
    return {
      columnId,
      width: DEFAULT_MIN_WIDTH,
      minWidth: DEFAULT_MIN_WIDTH,
      idealWidth: DEFAULT_WIDTH,
      padding: 16,
    };
  });

  if (updatedState.length !== state.length) {
    return updatedState;
  }

  const a1 = state.map(({ columnId }) => columnId);
  const a2 = updatedState.map(({ columnId }) => columnId);

  if (!a1.every((v, i) => v === a2[i])) {
    updated = true;
  }

  return updated ? updatedState : state;
}

function getColumnById(state: ColumnWidthState[], columnId: ColumnId) {
  return state.find(c => c.columnId === columnId);
}

function getColumnByIndex(state: ColumnWidthState[], index: number) {
  return state[index];
}

function getTotalWidth(state: ColumnWidthState[]): number {
  return state.reduce((sum, column) => sum + column.width + column.padding, 0);
}

function getLastColumn(state: ColumnWidthState[]) {
  return state[state.length - 1];
}

function getLength(state: ColumnWidthState[]) {
  return state.length;
}

function getColumnWidth(state: ColumnWidthState[], columnId: ColumnId): number {
  const column = getColumnById(state, columnId);
  return column?.width ?? 0;
}

/**
 * This function takes the current state and returns an updated state, so that it can be set.
 * The reason for this is that we can update the state multiple times before commiting to render.
 * This is an optimization and also prevents flickering.
 * It also returns new copy of the state only if the value is different than the one currently in
 * the state, further preventing unnecessary updates.
 * @param localState
 * @param columnId
 * @param property
 * @param value
 * @returns
 */
function setColumnProperty(
  localState: ColumnWidthState[],
  columnId: ColumnId,
  property: keyof ColumnWidthState,
  value: number,
) {
  const currentColumn = getColumnById(localState, columnId);

  if (!currentColumn || currentColumn?.[property] === value) {
    return localState;
  }

  const updatedColumn = { ...currentColumn, [property]: value };

  const newState = localState.reduce((acc, current) => {
    if (current.columnId === updatedColumn.columnId) {
      return [...acc, updatedColumn];
    }
    return [...acc, current];
  }, [] as ColumnWidthState[]);

  return newState;
}

/**
 * This function takes the state and container width and makes sure the each column in the state
 * is its optimal width, and that the columns
 * a) fit to the container
 * b) always fill the whole container
 * @param state
 * @param containerWidth
 * @returns
 */
function adjustColumnWidthsToFitContainer(state: ColumnWidthState[], containerWidth: number) {
  let newState = state;
  let i;
  const totalWidth = getTotalWidth(newState);

  // The total width is smaller, we are expanding columns
  if (totalWidth < containerWidth) {
    let difference = containerWidth - totalWidth;
    i = 0;
    // We start at the beginning and assign the columns their ideal width
    while (i < newState.length && difference > 0) {
      const currentCol = getColumnByIndex(newState, i);
      const colAdjustment = Math.min(currentCol.idealWidth - currentCol.width, difference);
      newState = setColumnProperty(newState, currentCol.columnId, 'width', currentCol.width + colAdjustment);
      difference -= colAdjustment;

      // if there is still empty space, after all columns are their ideal sizes, assign it to the last column
      if (i === newState.length - 1 && difference > 0) {
        newState = setColumnProperty(newState, currentCol.columnId, 'width', currentCol.width + difference);
      }

      i++;
    }
  }

  // The total width is larger than container, we need to squash the columns
  else if (totalWidth > containerWidth) {
    let difference = totalWidth - containerWidth;
    // We start with the last column
    i = newState.length - 1;
    while (i >= 0 && difference > 0) {
      const currentCol = getColumnByIndex(newState, i);
      if (currentCol.width > currentCol.minWidth) {
        const colAdjustment = Math.min(currentCol.width - currentCol.minWidth, difference);
        difference -= colAdjustment;
        newState = setColumnProperty(newState, currentCol.columnId, 'width', currentCol.width - colAdjustment);
      }
      i--;
    }
  }

  return newState;
}

export function useColumnResizeState<T>(columns: ColumnDefinition<T>[]): ColumnResizeState {
  const [state, setState] = useState<ColumnWidthState[]>(columnDefinitionsToState(columns));
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    // First, make sure we update the state with the last columns received as parameter
    const intermediateState = columnDefinitionsToState(columns, state);
    // then use this new state and recalculate any widths as necessary
    setState(adjustColumnWidthsToFitContainer(intermediateState, containerWidth));
  }, [columns, containerWidth, state]);

  const setColumnWidth = (columnId: ColumnId, width: number) => {
    const column = getColumnById(state, columnId);
    let newState = [...state];

    // Return early if the new width should result in smaller than minimum
    if (!column || width < column.minWidth) {
      return;
    }

    // Adjust the column width and measure the new total width
    newState = setColumnProperty(newState, columnId, 'width', width);
    // Set this width as idealWidth, because its a deliberate change, not a recalculation because of container
    newState = setColumnProperty(newState, columnId, 'idealWidth', width);
    // Adjust the widths to the container size
    newState = adjustColumnWidthsToFitContainer(newState, containerWidth);

    // Commit the state update
    setState(newState);
  };

  const resetLayout = (availableSize: number) => {
    let widthToFill = availableSize;
    let newState = [...state];

    // first pass, set columns to min
    let i = 0;
    while (i < newState.length) {
      const column = newState[i];
      newState = setColumnProperty(newState, column.columnId, 'width', column.minWidth);
      widthToFill = availableSize - getTotalWidth(newState);
      i++;
    }

    // second pass, set columns to ideal width
    i = 0;
    while (i < newState.length) {
      const column = newState[i];
      if (widthToFill > column.idealWidth + column.padding) {
        newState = setColumnProperty(newState, column.columnId, 'width', column.idealWidth);
        widthToFill = availableSize - getTotalWidth(newState);
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
    setContainerWidth: (width: number) => setContainerWidth(width),
    resetLayout,
  };
}
