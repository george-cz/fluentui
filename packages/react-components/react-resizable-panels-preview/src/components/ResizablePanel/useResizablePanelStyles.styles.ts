import { makeResetStyles, mergeClasses } from '@griffel/react';
import type { SlotClassNames } from '@fluentui/react-utilities';
import type { ResizablePanelSlots, ResizablePanelState } from './ResizablePanel.types';

export const resizablePanelClassNames: SlotClassNames<ResizablePanelSlots> = {
  root: 'fui-ResizablePanel',
};

/**
 * Styles for the root slot
 */
const useRootBaseStyles = makeResetStyles({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/**
 * Apply styling to the ResizablePanel slots based on the state
 */
export const useResizablePanelStyles_unstable = (state: ResizablePanelState): ResizablePanelState => {
  const rootBaseStyles = useRootBaseStyles();
  state.root.className = mergeClasses(resizablePanelClassNames.root, rootBaseStyles, state.root.className);
  return state;
};
