import {
  ColumnDefinition,
  ColumnId,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  createColumn,
  useColumnSizing,
  useTableFeatures,
} from '@fluentui/react-components/unstable';
import * as React from 'react';
import { useState } from 'react';

type Item = {
  first: number;
  second: number;
  third: number;
  fourth: number;
};

const columnsDef: ColumnDefinition<Item>[] = [
  createColumn<Item>({
    columnId: 'first',
    compare: (a, b) => {
      return a.first - b.first;
    },
  }),
  createColumn<Item>({
    columnId: 'second',
    compare: (a, b) => {
      return a.second - b.second;
    },
  }),
  createColumn<Item>({
    columnId: 'third',
    compare: (a, b) => {
      return a.third - b.third;
    },
  }),
  createColumn<Item>({
    columnId: 'fourth',
    compare: (a, b) => {
      return a.fourth - b.fourth;
    },
  }),
];

const items: Item[] = new Array(10).fill(0).map((_, i) => ({ first: i, second: i, third: i, fourth: i }));

export const ResizingControlled = () => {
  const [columns, setColumns] = useState<ColumnDefinition<Item>[]>(columnsDef);

  const insertColumn = () => {
    const newColumn = createColumn<Item>({
      columnId: Date.now().toString().split('').slice(-4).join(''),
      compare: (a, b) => {
        return a.first - b.first;
      },
    });
    setColumns([...columns, newColumn]);
  };
  const removeColumn = () => {
    setColumns([...columns.slice(0, 2), ...columns.slice(3)]);
  };

  const { getRows, columnSizing, tableRef } = useTableFeatures(
    {
      columns,
      items,
    },
    [useColumnSizing()],
  );

  console.log(
    '???',
    columns.length,
    columns.map(c => columnSizing.getColumnProps(c.columnId).style),
  );

  return (
    <>
      <button onClick={insertColumn}>Add column</button>
      <button onClick={removeColumn}>Remove column</button>
      <Table ref={tableRef} columnSizingState={columnSizing}>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHeaderCell key={column.columnId} {...columnSizing.getColumnProps(column.columnId)}>
                Header {column.columnId}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {getRows().map(({ item }, i) => (
            <TableRow key={i}>
              {columns.map(column => (
                <TableCell key={column.columnId} {...columnSizing.getColumnProps(column.columnId)}>
                  {item.first}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
