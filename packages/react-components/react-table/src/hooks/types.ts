import * as React from 'react';
import { SortDirection } from '../components/Table/Table.types';

export type TableRowId = string | number;
export type TableColumnId = string | number;
export type SelectionMode = 'single' | 'multiselect';

export interface SortState {
  sortColumn: TableColumnId | undefined;
  sortDirection: SortDirection;
}

export interface OnSelectionChangeData {
  selectedItems: Set<TableRowId>;
}

export interface CreateTableColumnOptions<TItem> extends Partial<TableColumnDefinition<TItem>> {
  columnId: TableColumnId;
}

export interface TableColumnDefinition<TItem> {
  columnId: TableColumnId;
  compare: (a: TItem, b: TItem) => number;
  renderHeaderCell: () => React.ReactNode;
  renderCell: (item: TItem) => React.ReactNode;
}

export type RowEnhancer<TItem, TRowState extends TableRowData<TItem> = TableRowData<TItem>> = (
  row: TableRowData<TItem>,
) => TRowState;

export interface TableSortState<TItem> {
  /**
   * Current sort direction
   */
  sortDirection: SortDirection;
  /**
   * Column id of the currently sorted column
   */
  sortColumn: TableColumnId | undefined;
  /**
   * Set the sort direction for the specified column
   */
  setColumnSort: (event: React.SyntheticEvent, columnId: TableColumnId, sortDirection: SortDirection) => void;
  /**
   * Toggles the sort direction for specified column
   */
  toggleColumnSort: (event: React.SyntheticEvent, columnId: TableColumnId) => void;
  /**
   * Returns the sort direction if a column is sorted,
   * returns undefined if the column is not sorted
   */
  getSortDirection: (columnId: TableColumnId) => SortDirection | undefined;

  /**
   * Sorts rows and returns a **shallow** copy of original items
   */
  sort: <TRowState extends TableRowData<TItem>>(rows: TRowState[]) => TRowState[];
}

export interface TableSelectionState {
  /**
   * Clears all selected rows
   */
  clearRows: (e: React.SyntheticEvent) => void;
  /**
   * Selects single row
   */
  selectRow: (e: React.SyntheticEvent, rowId: TableRowId) => void;
  /**
   * De-selects single row
   */
  deselectRow: (e: React.SyntheticEvent, rowId: TableRowId) => void;
  /**
   * Toggle selection of all rows
   */
  toggleAllRows: (e: React.SyntheticEvent) => void;
  /**
   * Toggle selection of single row
   */
  toggleRow: (e: React.SyntheticEvent, rowId: TableRowId) => void;
  /**
   * Collection of row ids corresponding to selected rows
   */
  selectedRows: Set<TableRowId>;
  /**
   * Whether all rows are selected
   */
  allRowsSelected: boolean;
  /**
   * Whether some rows are selected
   */
  someRowsSelected: boolean;

  /**
   * Checks if a given rowId is selected
   */
  isRowSelected: (rowId: TableRowId) => boolean;

  selectionMode: SelectionMode;
}

export interface TableRowData<TItem> {
  /**
   * User provided data
   */
  item: TItem;
  /**
   * The row id, defaults to index position in the collection
   */
  rowId: TableRowId;
}

export interface TableFeaturesState<TItem> extends Pick<UseTableFeaturesOptions<TItem>, 'items' | 'getRowId'> {
  /**
   * The row data for rendering
   * @param rowEnhancer - Enhances the row with extra user data
   */
  getRows: <TRowState extends TableRowData<TItem> = TableRowData<TItem>>(
    rowEnhancer?: RowEnhancer<TItem, TRowState>,
  ) => TRowState[];
  /**
   * State and actions to manage row selection
   */
  selection: TableSelectionState;
  /**
   * State and actions to manage row sorting
   */
  sort: TableSortState<TItem>;
  /**
   * Table columns
   */
  columns: TableColumnDefinition<TItem>[];

  columnSizing: TableColumnSizingState;

  tableRef: React.RefObject<HTMLDivElement>;
}

export interface UseTableSortOptions {
  /**
   * Used to control sorting
   */
  sortState?: SortState;
  /**
   * Used in uncontrolled mode to set initial sort column and direction on mount
   */
  defaultSortState?: SortState;
  /**
   * Called when sort changes
   */
  onSortChange?(e: React.SyntheticEvent, state: SortState): void;
}

export interface UseTableSelectionOptions {
  /**
   * Can be multi or single select
   */
  selectionMode: SelectionMode;
  /**
   * Used in uncontrolled mode to set initial selected rows on mount
   */
  defaultSelectedItems?: Set<TableRowId>;
  /**
   * Used to control row selection
   */
  selectedItems?: Set<TableRowId>;
  /**
   * Called when selection changes
   */
  onSelectionChange?(e: React.SyntheticEvent, data: OnSelectionChangeData): void;
}

export interface UseTableFeaturesOptions<TItem> {
  columns: TableColumnDefinition<TItem>[];
  items: TItem[];
  getRowId?: (item: TItem) => TableRowId;
}

export type TableFeaturePlugin = <TItem>(tableState: TableFeaturesState<TItem>) => TableFeaturesState<TItem>;

export interface ColumnWidthState {
  columnId: TableColumnId;
  width: number;
  minWidth: number;
  idealWidth: number;
  padding: number;
}

export interface ColumnWidthProps {
  style?: React.CSSProperties;
  columnId?: TableColumnId;
}

export interface TableColumnSizingState {
  getOnMouseDown: (columnId: TableColumnId) => (e: React.MouseEvent<HTMLElement>) => void;
  getColumnWidth: (columnId: TableColumnId) => number;
  getTotalWidth: () => number;
  setColumnWidth: (columnId: TableColumnId, newSize: number) => void;
  getColumnWidths: () => ColumnWidthState[];
  getColumnProps: (columnId: TableColumnId) => ColumnWidthProps;
}

export type ColumnResizeState = {
  getColumnWidth: (columnId: TableColumnId) => number;
  getTotalWidth: () => number;
  setColumnWidth: (columnId: TableColumnId, width: number) => void;
  setColumnIdealWidth: (columnId: TableColumnId, minWidth: number) => void;
  getLastColumn: () => ColumnWidthState;
  getLength: () => number;
  getColumnByIndex: (index: number) => ColumnWidthState;
  getColumnById: (columnId: TableColumnId) => ColumnWidthState | undefined;
  getColumns: () => ColumnWidthState[];
};

export type ColumnSizingOptions = Record<
  TableColumnId,
  Partial<Pick<ColumnWidthState, 'minWidth' | 'idealWidth' | 'padding'>> & { defaultWidth?: number }
>;

export type UseColumnSizingParams = {
  columnSizingOptions?: ColumnSizingOptions;
  onColumnResize?: (columnId: TableColumnId, width: number) => void;
};
