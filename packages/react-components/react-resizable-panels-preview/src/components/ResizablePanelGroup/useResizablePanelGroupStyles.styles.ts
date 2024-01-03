import { makeStyles, mergeClasses } from '@griffel/react';
import type { SlotClassNames } from '@fluentui/react-utilities';
import type { ResizablePanelGroupSlots, ResizablePanelGroupState } from './ResizablePanelGroup.types';

export const resizablePanelGroupClassNames: SlotClassNames<ResizablePanelGroupSlots> = {
  root: 'fui-ResizablePanelGroup',
  // TODO: add class names for all slots on ResizablePanelGroupSlots.
  // Should be of the form `<slotName>: 'fui-ResizablePanelGroup__<slotName>`
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
 * Apply styling to the ResizablePanelGroup slots based on the state
 */
export const useResizablePanelGroupStyles_unstable = (state: ResizablePanelGroupState): ResizablePanelGroupState => {
  const styles = useStyles();
  state.root.className = mergeClasses(resizablePanelGroupClassNames.root, styles.root, state.root.className);

  // TODO Add class names to slots, for example:
  // state.mySlot.className = mergeClasses(styles.mySlot, state.mySlot.className);

  return state;
};
