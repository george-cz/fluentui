import { makeStyles, mergeClasses } from '@griffel/react';
import type { SlotClassNames } from '@fluentui/react-utilities';
import type { ResizablePanelSlots, ResizablePanelState } from './ResizablePanel.types';

export const resizablePanelClassNames: SlotClassNames<ResizablePanelSlots> = {
  root: 'fui-ResizablePanel',
  // TODO: add class names for all slots on ResizablePanelSlots.
  // Should be of the form `<slotName>: 'fui-ResizablePanel__<slotName>`
};

/**
 * Styles for the root slot
 */
const useStyles = makeStyles({
  root: {
    // TODO Add default styles for the root element
  },

  // TODO add additional classes for different states and/or slots
});

/**
 * Apply styling to the ResizablePanel slots based on the state
 */
export const useResizablePanelStyles_unstable = (state: ResizablePanelState): ResizablePanelState => {
  const styles = useStyles();
  state.root.className = mergeClasses(resizablePanelClassNames.root, styles.root, state.root.className);

  // TODO Add class names to slots, for example:
  // state.mySlot.className = mergeClasses(styles.mySlot, state.mySlot.className);

  return state;
};
