import { makeResetStyles, makeStyles, mergeClasses } from '@griffel/react';
import type { SlotClassNames } from '@fluentui/react-utilities';
import type { ResizablePanelGroupSlots, ResizablePanelGroupState } from './ResizablePanelGroup.types';

export const resizablePanelGroupClassNames: SlotClassNames<ResizablePanelGroupSlots> = {
  root: 'fui-ResizablePanelGroup',
  // TODO: add class names for all slots on ResizablePanelGroupSlots.
  // Should be of the form `<slotName>: 'fui-ResizablePanelGroup__<slotName>`
};

const useRootBaseStyles = makeResetStyles({
  display: 'flex',
  flexDirection: 'row',
});

const useRootStyles = makeStyles({
  vertical: {
    flexDirection: 'column',
  },
});

/**
 * Apply styling to the ResizablePanelGroup slots based on the state
 */
export const useResizablePanelGroupStyles_unstable = (state: ResizablePanelGroupState): ResizablePanelGroupState => {
  const rootBaseStyle = useRootBaseStyles();
  const rootStyles = useRootStyles();

  state.root.className = mergeClasses(
    resizablePanelGroupClassNames.root,
    rootBaseStyle,
    state.layout === 'vertical' && rootStyles.vertical,
    state.root.className,
  );

  // TODO Add class names to slots, for example:
  // state.mySlot.className = mergeClasses(styles.mySlot, state.mySlot.className);

  return state;
};
