import * as React from 'react';
import { getNativeElementProps, slot, useEventCallback } from '@fluentui/react-utilities';
import { useArrowNavigationGroup } from '@fluentui/react-tabster';
import { ListLayout, ListProps, ListState, IList } from './List.types';
import { useListFeatures } from '../../hooks/useListFeatures';
import { useListSelection } from '../../hooks/useListSelection';

const useComponentRef = (componentRef: React.Ref<IList> | undefined, selection: ListState['selection']) => {
  React.useImperativeHandle(
    componentRef,
    () => ({
      selection,
    }),
    [selection],
  );
};

/**
 * Create the state required to render List.
 *
 * The returned state can be modified with hooks such as useListStyles_unstable,
 * before being passed to renderList_unstable.
 *
 * @param props - props from this instance of List
 * @param ref - reference to root HTMLElement of List
 */
export const useList_unstable = (props: ListProps, ref: React.Ref<HTMLElement>): ListState => {
  const {
    layout = ListLayout.Vertical,
    focusableItems = false,
    customArrowNavigationOptions,
    selectable = false,
    selectionMode = 'multiselect',
    componentRef,
    onSelectionChange,
  } = props;

  const arrowNavigationAttributes = useArrowNavigationGroup({
    axis: layout === ListLayout.Grid ? 'grid-linear' : 'both',
    memorizeCurrent: true,
    ...(customArrowNavigationOptions || {}),
  });

  const [items, setItems] = React.useState<Array<{ id: string | number }>>([]);

  const { selection } = useListFeatures({ items }, [useListSelection({ onSelectionChange, selectionMode })]);
  useComponentRef(componentRef, selection);

  const registerItem = useEventCallback((id: string | number) => {
    if (!items.find(item => item.id === id)) {
      setItems(current => [...current, { id }]);
    }
  });

  const deregisterItem = useEventCallback((id: string | number) => {
    if (items.find(k => k.id === id)) {
      setItems(current => current.filter(item => item.id !== id));
    }
  });

  return {
    components: {
      root: 'ul',
    },
    root: slot.always(
      getNativeElementProps('ul', {
        ref,
        role: selectable ? 'listbox' : 'list',
        tabIndex: -1,
        'aria-multiselectable': selectable ? true : undefined, // TODO not true for single select
        ...arrowNavigationAttributes,
        ...props,
      }),
      { elementType: 'ul' },
    ),
    layout,
    // context:
    focusableItems,
    items,
    registerItem,
    deregisterItem,
    selectable,
    selection,
  };
};
