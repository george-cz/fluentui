import type { SlotClassNames } from '@fluentui/react-utilities';
import { makeStyles, mergeClasses, shorthands } from '@griffel/react';
import { createCustomFocusIndicatorStyle } from '@fluentui/react-tabster';
import type { ListItemSlots, ListItemState } from './ListItem.types';
import { tokens } from '@fluentui/react-theme';

export const listItemClassNames: SlotClassNames<ListItemSlots> = {
  root: 'fui-ListItem',
  button: 'fui-ListItem__button',
  checkbox: 'fui-ListItem__checkbox',
};

/**
 * Styles for the root slot
 */
const useStyles = makeStyles({
  root: {
    ...createCustomFocusIndicatorStyle(
      {
        ...shorthands.outline('2px', 'solid', tokens.colorStrokeFocus2),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
      },
      { selector: 'focus' },
    ),
  },

  rootSelectable: {
    display: 'flex',
  },

  button: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    ...shorthands.padding(0),
  },
});

/**
 * Apply styling to the ListItem slots based on the state
 */
export const useListItemStyles_unstable = (state: ListItemState): ListItemState => {
  const styles = useStyles();
  state.root.className = mergeClasses(
    listItemClassNames.root,
    styles.root,
    state.selectable && styles.rootSelectable,
    state.root.className,
  );

  if (state.button) {
    state.button.className = mergeClasses(listItemClassNames.button, styles.button, state.button?.className);
  }

  if (state.checkbox) {
    state.checkbox.className = mergeClasses(listItemClassNames.checkbox, state.checkbox?.className);
  }

  return state;
};
