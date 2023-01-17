import * as React from 'react';
import { ColumnId, TableColumnSizingOptions, ColumnWidthProps, ColumnWidthState } from './types';

const DEFAULT_WIDTH = 150;
const DEFAULT_MAX_WIDTH = 999999;
const DEFAULT_MIN_WIDTH = DEFAULT_WIDTH;

export interface ColumnWidthOptions
  extends Partial<Pick<ColumnWidthState, 'width' | 'maxWidth' | 'minWidth' | 'padding'>>,
    Pick<ColumnWidthState, 'columnId'> {}

export class ColumnResize {
  public columns: ColumnWidthState[];
  private mouseX: number = 0;
  private totalDistanceTraveled: number = 0;
  private onColumnWidthsUpdate: () => void;
  private container: HTMLElement;
  private tableElement: HTMLElement | null = null;
  private resizing: boolean = false;
  private resizeObserver: ResizeObserver;
  private options?: TableColumnSizingOptions;

  constructor(columns: ColumnWidthOptions[], onColumnWidthsUpdate: () => void, options: TableColumnSizingOptions) {
    this.columns = columns.map(column => {
      const {
        columnId,
        width = DEFAULT_WIDTH,
        maxWidth = DEFAULT_MAX_WIDTH,
        minWidth = DEFAULT_MIN_WIDTH,
        padding = 16,
      } = column;
      return {
        columnId,
        width: DEFAULT_WIDTH,
        maxWidth,
        minWidth,
        idealWidth: width,
        padding,
      };
    });

    this.onColumnWidthsUpdate = onColumnWidthsUpdate;
    this.container = document.body;
    this.resizeObserver = new ResizeObserver(this._handleResize);
    this.options = options;
  }

  // this needs to be refactored
  public updateColumns(columns: ColumnWidthOptions[]) {
    // new definition
    const cols = columns.map(column => {
      const {
        columnId,
        width = DEFAULT_WIDTH,
        maxWidth = DEFAULT_MAX_WIDTH,
        minWidth = DEFAULT_MIN_WIDTH,
        padding = 16,
      } = column;
      return {
        columnId,
        width: DEFAULT_WIDTH,
        maxWidth,
        minWidth,
        idealWidth: width,
        padding,
      };
    });

    // update for existing columns
    this.columns = cols.map(column => {
      const existingColumn = this.columns.find(col => col.columnId === column.columnId);
      if (existingColumn) {
        return { ...existingColumn, ...column, width: existingColumn.width, idealWidth: existingColumn.idealWidth };
      } else {
        return column;
      }
    });

    // resize last column to fill the table
    const { width: availableWidth } = this.container.getBoundingClientRect();
    const lastColumn = this.columns[this.columns.length - 1];
    const totalWidth = this.totalWidth;

    if (totalWidth < availableWidth) {
      this.setColumnWidth(lastColumn.columnId, (lastColumn.width += availableWidth - totalWidth), false);
    } else {
      this.setColumnWidth(lastColumn.columnId, lastColumn.minWidth, false);
    }

    this._updateTableStyles();
    this.onColumnWidthsUpdate();
  }

  public updateOptions(options: TableColumnSizingOptions) {
    this.options = options;
  }

  public init(table: HTMLElement) {
    this.container = document.createElement('div');
    this.tableElement = table;
    table.insertAdjacentElement('beforebegin', this.container);
    this.resetLayout();
    this.resizeObserver.observe(this.container);
  }

  public getColumnWidth(columnId: ColumnId) {
    return this._getColumn(columnId).width;
  }

  public get totalWidth() {
    return this.columns.reduce((sum, column) => sum + column.width + column.padding, 0);
  }

  public handleLastColumnResize(columnId: ColumnId) {
    if (columnId !== this.columns[this.columns.length - 1].columnId) {
      return;
    }
    if (this.totalDistanceTraveled < 0) {
      const mouseDistance = Math.abs(this.totalDistanceTraveled);
      const availableSpace =
        this.columns[this.columns.length - 1].width - this.columns[this.columns.length - 1].minWidth;
      if (availableSpace > mouseDistance) {
        this.options?.onColSpaceAvailable?.(mouseDistance);
      }
    }
  }

  public setColumnWidth(columnId: ColumnId, newWidth: number, isSettingDirectly = true) {
    const state = this._getColumn(columnId);
    const availableWidth = this.container.getBoundingClientRect().width;

    if (newWidth >= state.minWidth) {
      const dx = state.width - newWidth;

      state.width = newWidth;
      if (isSettingDirectly) {
        state.idealWidth = newWidth;
      }

      let totalWidth = this.totalWidth;

      if (totalWidth <= availableWidth) {
        this.columns[this.columns.length - 1].width += dx;
        if (dx > 0) {
          const potentialSpace =
            this.columns[this.columns.length - 1].width - this.columns[this.columns.length - 1].idealWidth;
          this.options?.onColSpaceAvailable?.(potentialSpace);
        }
      }

      // Total resulting width is bigger than available width
      let i = this.columns.length - 1;
      while (i >= 0 && totalWidth > availableWidth) {
        const column = this.columns[i];

        if (column.width > column.minWidth) {
          const diffAvailableWidth = totalWidth - availableWidth;
          const adjust = Math.min(column.width - column.minWidth, diffAvailableWidth);
          column.width -= adjust;
          totalWidth -= adjust;
        } else {
          // notify user so that they can hide the rightmost column
          // only if we are not moving the right most column
          if (columnId !== this.columns[this.columns.length - 1].columnId) {
            this.options?.onColumnOverflow?.(column.columnId);
            // this.totalDistanceTraveled = -column.minWidth;
          }
        }
        i--;
      }
    }

    this._updateTableStyles();
    this.onColumnWidthsUpdate();
  }

  public getOnMouseDown(columnId: ColumnId) {
    return (mouseDownEvent: React.MouseEvent<HTMLElement>) => {
      // ignore other buttons than primary mouse button
      if (mouseDownEvent.target !== mouseDownEvent.currentTarget || mouseDownEvent.button !== 0) {
        return;
      }

      this.resizing = true;

      this.mouseX = mouseDownEvent.clientX;

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
        this.totalDistanceTraveled = 0;
        this.resizing = false;
      };

      const onMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - this.mouseX;
        this.totalDistanceTraveled = this.totalDistanceTraveled + dx;
        this.mouseX = e.clientX;
        const currentWidth = this.getColumnWidth(columnId);
        this.handleLastColumnResize(columnId);
        this.setColumnWidth(columnId, currentWidth + dx, true);
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    };
  }

  public resetLayout() {
    let { width: availableWidth } = this.container.getBoundingClientRect();

    // first pass: columns to min width
    let i = 0;
    while (i < this.columns.length && availableWidth > this.columns[i].minWidth + this.columns[i].padding) {
      const column = this.columns[i];
      availableWidth -= column.minWidth + column.padding;
      column.width = column.minWidth;
      i++;
    }

    // second pass: columns to set width
    i = 0;
    while (i < this.columns.length && availableWidth > this.columns[i].idealWidth) {
      const column = this.columns[i];
      availableWidth -= column.idealWidth - column.width;
      column.width = column.idealWidth;
      i++;
    }

    // Last cell gets all the rest
    if (availableWidth) {
      this.columns[this.columns.length - 1].width += availableWidth;
    }

    this._updateTableStyles();
    this.onColumnWidthsUpdate();
  }

  public getColumnProps(columnId: ColumnId): ColumnWidthProps {
    try {
      const width = this.getColumnWidth(columnId);
      const style = {
        // native styles
        width,

        // non-native element styles (flex layout)
        minWidth: width,
        maxWidth: width,
      };
      return {
        columnId,
        style,
      };
    } catch {
      return { style: {}, columnId: '' };
    }
  }

  private _getColumn(columnId: ColumnId) {
    const state = this.columns.find(column => column.columnId === columnId);
    if (!state) {
      throw new Error(`Column ${columnId} does not exist`);
    }

    return state;
  }

  private _handleResize = () => {
    if (this.resizing) {
      return;
    }

    const { width: availableWidth } = this.container.getBoundingClientRect();

    let totalWidth = this.totalWidth;
    if (availableWidth > totalWidth) {
      this.columns[this.columns.length - 1].width += availableWidth - totalWidth;
    } else {
      let i = this.columns.length - 1;
      while (i >= 0 && totalWidth > availableWidth) {
        const column = this.columns[i];

        if (column.width > column.minWidth) {
          const diffAvailableWidth = totalWidth - availableWidth;
          const adjust = Math.min(column.width - column.minWidth, diffAvailableWidth);
          column.width -= adjust;
          totalWidth -= adjust;
        }
        i--;
      }
    }

    this._updateTableStyles();
    this.onColumnWidthsUpdate();
  };

  private _updateTableStyles() {
    if (this.tableElement) {
      Object.assign(this.tableElement.style, {
        tableLayout: 'fixed',
        width: `${this.totalWidth}px`,
      });
    }
  }
}
