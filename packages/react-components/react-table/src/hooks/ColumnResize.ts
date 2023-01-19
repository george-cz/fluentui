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
  private container: HTMLElement;
  private tableElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver;
  private options?: TableColumnSizingOptions;

  constructor(state: ColumnResizeState, options: TableColumnSizingOptions) {
    this.state = state;
    this.container = document.body;
    this.resizeObserver = new ResizeObserver(this._handleResize);
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

      this.mouseX = mouseDownEvent.clientX;

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
        this.totalDistanceTraveled = 0;
      };

      const onMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - this.mouseX;
        this.totalDistanceTraveled = this.totalDistanceTraveled + dx;
        this.mouseX = e.clientX;
        const currentWidth = this.state.getColumnWidth(columnId);
        this.handleLastColumnResize(columnId);
        this.setColumnWidth(columnId, currentWidth + dx, true);
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    };
  }

  public updateState(state: ColumnResizeState) {
    this.state = state;
    this._updateTableStyles();
  }

  public updateOptions(options: TableColumnSizingOptions) {
    this.options = options;
  }

  private _handleResize = () => {
    const { width } = this.container.getBoundingClientRect();
    this.state.setContainerWidth(width);
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
