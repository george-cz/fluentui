/** @jsxRuntime classic */
/** @jsx createElement */

import { createElement } from '@fluentui/react-jsx-runtime';
import { assertSlots } from '@fluentui/react-utilities';
import type { ListItemButtonState, ListItemButtonSlots } from './ListItemButton.types';

/**
 * Render the final JSX of ListItemButton
 */
export const renderListItemButton_unstable = (state: ListItemButtonState) => {
  assertSlots<ListItemButtonSlots>(state);
  return <state.root />;
};
