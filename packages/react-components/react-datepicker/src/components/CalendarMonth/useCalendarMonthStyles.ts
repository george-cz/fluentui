import { makeStyles, mergeClasses } from '@griffel/react';
import type { CalendarMonthSlots, CalendarMonthState } from './CalendarMonth.types';
import type { SlotClassNames } from '@fluentui/react-utilities';

export const calendarMonthClassNames: SlotClassNames<CalendarMonthSlots> = {
  root: 'fui-CalendarMonth',
  // TODO: add class names for all slots on CalendarMonthSlots.
  // Should be of the form `<slotName>: 'fui-CalendarMonth__<slotName>`
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
 * Apply styling to the CalendarMonth slots based on the state
 */
export const useCalendarMonthStyles_unstable = (state: CalendarMonthState): CalendarMonthState => {
  const styles = useStyles();
  state.root.className = mergeClasses(calendarMonthClassNames.root, styles.root, state.root.className);

  // TODO Add class names to slots, for example:
  // state.mySlot.className = mergeClasses(styles.mySlot, state.mySlot.className);

  return state;
};
