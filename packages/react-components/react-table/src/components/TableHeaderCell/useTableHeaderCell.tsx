import { useARIAButtonShorthand } from '@fluentui/react-aria';
import { ArrowDownRegular, ArrowUpRegular } from '@fluentui/react-icons';
import { getNativeElementProps, resolveShorthand, useMergedRefs } from '@fluentui/react-utilities';
import * as React from 'react';
import { useTableContext } from '../../contexts/tableContext';
import type { TableHeaderCellProps, TableHeaderCellState } from './TableHeaderCell.types';
import { useFocusWithin } from '@fluentui/react-tabster';
import { MenuList } from '@fluentui/react-menu';

const sortIcons = {
  ascending: <ArrowUpRegular fontSize={12} />,
  descending: <ArrowDownRegular fontSize={12} />,
};

/**
 * Create the state required to render TableHeaderCell.
 *
 * The returned state can be modified with hooks such as useTableHeaderCellStyles_unstable,
 * before being passed to renderTableHeaderCell_unstable.
 *
 * @param props - props from this instance of TableHeaderCell
 * @param ref - reference to root HTMLElement of TableHeaderCell
 */
export const useTableHeaderCell_unstable = (
  props: TableHeaderCellProps,
  ref: React.Ref<HTMLElement>,
): TableHeaderCellState => {
  const { noNativeElements, sortable, accessibilityMenuOptions } = useTableContext();

  const rootComponent = props.as ?? noNativeElements ? 'div' : 'th';
  return {
    components: {
      root: rootComponent,
      button: 'button',
      sortIcon: 'span',
      aside: 'span',
      accessibilityMenu: MenuList,
    },
    root: getNativeElementProps(rootComponent, {
      ref: useMergedRefs(ref, useFocusWithin()),
      role: rootComponent === 'div' ? 'columnheader' : undefined,
      'aria-sort': sortable ? props.sortDirection ?? 'none' : undefined,
      ...props,
    }),
    aside: resolveShorthand(props.aside),
    sortIcon: resolveShorthand(props.sortIcon, {
      required: !!props.sortDirection,
      defaultProps: { children: props.sortDirection ? sortIcons[props.sortDirection] : undefined },
    }),
    button: useARIAButtonShorthand(props.button, {
      required: true,
      defaultProps: {
        role: 'presentation',
        tabIndex: -1,
        type: 'button',
        ...(sortable && {
          role: undefined,
          tabIndex: undefined,
        }),
      },
    }),
    accessibilityMenu: {
      children: accessibilityMenuOptions,
    },
    sortable,
    noNativeElements,
    columnId: props.columnId,
  };
};
