import * as React from 'react';
import { ColumnId, TableColumnSizingOptions, ColumnWidthProps, ColumnWidthState, ColumnResizeState } from './types';

// const DEFAULT_WIDTH = 150;
// const DEFAULT_MAX_WIDTH = 999999;
// const DEFAULT_MIN_WIDTH = DEFAULT_WIDTH;

export interface ColumnWidthOptions
  extends Partial<Pick<ColumnWidthState, 'width' | 'minWidth' | 'padding'>>,
    Pick<ColumnWidthState, 'columnId'> {}

export class ColumnResize {
  public state: ColumnResizeState;
  private mouseX: number = 0;
  private totalDistanceTraveled: number = 0;
  // private onColumnWidthsUpdate: () => void;
  private container: HTMLElement;
  private tableElement: HTMLElement | null = null;
  private resizing: boolean = false;
  private resizeObserver: ResizeObserver;
  private options?: TableColumnSizingOptions;

  constructor(state: ColumnResizeState, options: TableColumnSizingOptions) {
    this.state = state;
    // this.onColumnWidthsUpdate = onColumnWidthsUpdate;
    this.container = document.body;
    this.resizeObserver = new ResizeObserver(this._handleResize);
    this.options = options;
  }

  // this needs to be refactored
  public updateColumns(columns: ColumnWidthOptions[]) {
    // // new definition
    // const cols = columns.map(column => {
    //   const {
    //     columnId,
    //     width = DEFAULT_WIDTH,
    //     maxWidth = DEFAULT_MAX_WIDTH,
    //     minWidth = DEFAULT_MIN_WIDTH,
    //     padding = 16,
    //   } = column;
    //   return {
    //     columnId,
    //     width: DEFAULT_WIDTH,
    //     maxWidth,
    //     minWidth,
    //     idealWidth: width,
    //     padding,
    //   };
    // });
    // // update for existing columns
    // this.columns = cols.map(column => {
    //   const existingColumn = this.columns.find(col => col.columnId === column.columnId);
    //   if (existingColumn) {
    //     return { ...existingColumn, ...column, width: existingColumn.width, idealWidth: existingColumn.idealWidth };
    //   } else {
    //     return column;
    //   }
    // });
    // // resize last column to fill the table
    // const { width: availableWidth } = this.container.getBoundingClientRect();
    // const lastColumn = this.columns[this.columns.length - 1];
    // const totalWidth = this.totalWidth;
    // if (totalWidth < availableWidth) {
    //   this.setColumnWidth(lastColumn.columnId, (lastColumn.width += availableWidth - totalWidth), false);
    // } else {
    //   this.setColumnWidth(lastColumn.columnId, lastColumn.minWidth, false);
    // }
    // this._updateTableStyles();
    // this.onColumnWidthsUpdate();
  }

  public updateOptions(options: TableColumnSizingOptions) {
    this.options = options;
  }

  public init(table: HTMLElement) {
    this.container = document.createElement('div');
    this.tableElement = table;
    table.insertAdjacentElement('beforebegin', this.container);

    const { width } = this.container.getBoundingClientRect();
    this.state.setContainerWidth(width);
    this.state.resetLayout(width);

    this.resizeObserver.observe(this.container);
  }

  public handleLastColumnResize(columnId: ColumnId) {
    if (columnId !== this.state.getLastColumn().columnId) {
      return;
    }
    if (this.totalDistanceTraveled < 0) {
      const mouseDistance = Math.abs(this.totalDistanceTraveled);
      const availableSpace = this.state.getLastColumn().width - this.state.getLastColumn().minWidth;
      if (availableSpace > mouseDistance) {
        this.options?.onColSpaceAvailable?.(mouseDistance);
      }
    }
  }

  public setColumnWidth(columnId: ColumnId, newWidth: number, isSettingDirectly = true) {
    // const column = this._getColumn(columnId);
    // const availableWidth = this.container.getBoundingClientRect().width;

    this.state.setColumnWidth(columnId, newWidth);

    // if (newWidth >= column.minWidth) {
    //   const dx = column.width - newWidth;

    //   const totalWidth = this.totalWidth + dx;
    //   this.state.setColumnWidth(column.columnId, newWidth, availableWidth);

    // if (totalWidth <= availableWidth) {
    //   const lastColumn = this.state.getLastColumn();
    //   this.state.setColumnWidth(lastColumn.columnId, lastColumn.width + dx);
    //   // this.columns[this.columns.length - 1].width += dx;

    //   if (dx > 0) {
    //     const potentialSpace = lastColumn.width - lastColumn.idealWidth;
    //     this.options?.onColSpaceAvailable?.(potentialSpace);
    //   }
    // }

    // Total resulting width is bigger than available width
    // let i = this.state.getLength() - 1;
    // while (i >= 0 && totalWidth > availableWidth) {
    //   const col = this.state.getColumnByIndex(i);

    //   if (col.width > col.minWidth) {
    //     const diffAvailableWidth = totalWidth - availableWidth;
    //     const adjust = Math.min(col.width - col.minWidth, diffAvailableWidth);
    //     this.state.setColumnWidth(col.columnId, col.width - adjust);

    //     if (isSettingDirectly && col.columnId !== columnId) {
    //       this.state.setColumnIdealWidth(col.columnId, newWidth);
    //     }

    //     totalWidth -= adjust;
    //   } else {
    //     // notify user so that they can hide the rightmost column
    //     // only if we are not moving the right most column
    //     if (columnId !== this.state.getLastColumn().columnId) {
    //       this.options?.onColumnOverflow?.(col.columnId);
    //       this.totalDistanceTraveled = -col.width;
    //     }
    //   }
    //   i--;
    // }
    // }

    // this._updateTableStyles();
    // this.onColumnWidthsUpdate();
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
        const currentWidth = this.state.getColumnWidth(columnId);
        columnId;
        this.handleLastColumnResize(columnId);
        this.setColumnWidth(columnId, currentWidth + dx, true);
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    };
  }

  public updateState(state: ColumnResizeState) {
    this.state = state;
  }

  private _handleResize = () => {
    const { width } = this.container.getBoundingClientRect();
    this.state.setContainerWidth(width);
    // if (this.resizing) {
    //   return;
    // }

    // const { width: availableWidth } = this.container.getBoundingClientRect();

    // let totalWidth = this.state.getTotalWidth();
    // if (availableWidth > totalWidth) {
    //   this.columns[this.columns.length - 1].width += availableWidth - totalWidth;
    // } else {
    //   let i = this.columns.length - 1;
    //   while (i >= 0 && totalWidth > availableWidth) {
    //     const column = this.columns[i];

    //     if (column.width > column.minWidth) {
    //       const diffAvailableWidth = totalWidth - availableWidth;
    //       const adjust = Math.min(column.width - column.minWidth, diffAvailableWidth);
    //       column.width -= adjust;
    //       totalWidth -= adjust;
    //     }
    //     i--;
    //   }
    // }

    // this._updateTableStyles();
    // this.onColumnWidthsUpdate();
  };

  private _updateTableStyles() {
    if (this.tableElement) {
      Object.assign(this.tableElement.style, {
        tableLayout: 'fixed',
        width: `${this.state.getTotalWidth()}px`,
      });
    }
  }
}
