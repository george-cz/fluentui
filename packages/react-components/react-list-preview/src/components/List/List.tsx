import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { useList_unstable } from './useList';
import { renderList_unstable } from './renderList';
import { useListStyles_unstable } from './useListStyles.styles';
import type { ListProps } from './List.types';
import { useListContextValues_unstable } from './useListContextValues';

/**
 * List component - TODO: add more docs
 */
export const List: ForwardRefComponent<ListProps> = React.forwardRef((props, ref) => {
  const state = useList_unstable(props, ref);
  const listContext = useListContextValues_unstable(state);

  useListStyles_unstable(state);
  return renderList_unstable(state, listContext);
});

List.displayName = 'List';
