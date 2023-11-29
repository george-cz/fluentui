import * as React from 'react';
import type { ComponentProps, ComponentState, Slot, SelectionMode, SelectionItemId } from '@fluentui/react-utilities';
import type { ListSelectionState } from '../../hooks/types';

type ListLayout = 'horizontal' | 'vertical' | 'grid';

export type ListSlots = {
  root: NonNullable<Slot<'ul', 'div' | 'ol'>>;
};

/**
 * List Props
 */
export type ListProps = ComponentProps<ListSlots> & {
  layout?: ListLayout;
  focusableItems?: boolean;
  selectable?: boolean;
  selectionMode?: SelectionMode;
  selectedItems?: SelectionItemId[];
  defaultSelectedItems?: SelectionItemId[];
  onSelectionChange?: (event: React.SyntheticEvent, data: { selectedItems: SelectionItemId[] }) => void;
};

export type ListContextValue = {
  focusableItems: boolean;
  selection?: ListSelectionState;
  as?: 'div' | 'ol' | 'ul';
};

export type ListContextValues = {
  listContext: ListContextValue;
};

/**
 * State used in rendering List
 */
export type ListState = ComponentState<ListSlots> & Required<Pick<ListProps, 'layout'>> & ListContextValue;
