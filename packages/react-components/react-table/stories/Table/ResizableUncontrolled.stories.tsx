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

type Item = {
  first: number;
  second: number;
  third: number;
  fourth: number;
};

const columns: ColumnDefinition<Item>[] = [
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

export const ResizableUncontrolled = () => {
  const {
    getRows,
    columnSizing: { getColumnWidth, setColumnWidth, getOnMouseDown },
    tableRef,
  } = useTableFeatures(
    {
      columns,
      items,
    },
    [useColumnSizing()],
  );

  const getColumnStyle = (columnId: ColumnId) => ({
    // minWidth: getColumnWidth(columnId),
    // maxWidth: getColumnWidth(columnId),
    width: getColumnWidth(columnId),
  });

  return (
    <>
      <Table ref={tableRef}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell style={getColumnStyle('first')}>
              First
              <Resizer onMouseDown={getOnMouseDown('first')} />
            </TableHeaderCell>
            <TableHeaderCell style={getColumnStyle('second')} onMouseDown={getOnMouseDown('second')}>
              Second
              <Resizer onMouseDown={getOnMouseDown('second')} />
            </TableHeaderCell>
            <TableHeaderCell style={getColumnStyle('third')} onMouseDown={getOnMouseDown('third')}>
              Third
              <Resizer onMouseDown={getOnMouseDown('third')} />
            </TableHeaderCell>
            <TableHeaderCell style={getColumnStyle('fourth')} onMouseDown={getOnMouseDown('fourth')}>
              Fourth
              <Resizer onMouseDown={getOnMouseDown('fourth')} />
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getRows().map(({ item }, i) => (
            <TableRow key={i}>
              <TableCell>{item.first}</TableCell>
              <TableCell>{item.second}</TableCell>
              <TableCell>{item.third}</TableCell>
              <TableCell>{item.fourth}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const Resizer: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  return (
    <div
      {...props}
      style={{
        borderRight: '2px solid red',
        height: 44,
        cursor: 'w-resize',
        paddingLeft: 4,
        paddingRight: 4,
        position: 'absolute',
        right: -8,
      }}
    />
  );
};
