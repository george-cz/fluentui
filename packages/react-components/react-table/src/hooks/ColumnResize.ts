import * as React from 'react';
import { ColumnId, ColumnSizingOptions, ColumnWidthProps, ColumnWidthState } from './types';

const DEFAULT_WIDTH = 150;
const DEFAULT_MAX_WIDTH = 999999;
const DEFAULT_MIN_WIDTH = DEFAULT_WIDTH;

export interface ColumnWidthOptions
  extends Partial<Pick<ColumnWidthState, 'width' | 'maxWidth' | 'minWidth' | 'padding'>>,
    Pick<ColumnWidthState, 'columnId'> {}

export class ColumnResize {
  public columns: ColumnWidthState[];
  private mouseX: number = 0;
  private onColumnWidthsUpdate: () => void;
  private container: HTMLElement;
  private tableElement: HTMLElement | null = null;
  private resizing: boolean = false;
  private resizeObserver: ResizeObserver;
  private options?: ColumnSizingOptions;

  constructor(columns: ColumnWidthOptions[], onColumnWidthsUpdate: () => void, options: ColumnSizingOptions) {
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

  public setColumnWidth(columnId: ColumnId, newWidth: number) {
    const state = this._getColumn(columnId);
    const availableWidth = this.container.getBoundingClientRect().width;

    if (newWidth >= state.minWidth && newWidth <= state.maxWidth) {
      const dx = state.width - newWidth;

      state.width = newWidth;
      let totalWidth = this.totalWidth;

      if (totalWidth <= availableWidth) {
        this.columns[this.columns.length - 1].width += dx;
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
          this.options?.onColumnOverflow?.('dfa');
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
        this.resizing = false;
      };

      const onMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - this.mouseX;
        this.mouseX = e.clientX;
        const currentWidth = this.getColumnWidth(columnId);
        this.setColumnWidth(columnId, currentWidth + dx);
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
