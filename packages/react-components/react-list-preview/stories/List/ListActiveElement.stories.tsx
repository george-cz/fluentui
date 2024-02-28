import {
  Button,
  makeStyles,
  Persona,
  shorthands,
  mergeClasses,
  Text,
  tokens,
  SelectionItemId,
} from '@fluentui/react-components';
import { Mic16Regular } from '@fluentui/react-icons';
import { List, ListItem } from '@fluentui/react-list-preview';

import * as React from 'react';
const names = [
  'Melda Bevel',
  'Demetra Manwaring',
  'Eusebia Stufflebeam',
  'Israel Rabin',
  'Bart Merrill',
  'Sonya Farner',
  'Kristan Cable',
];

type Item = {
  name: string;
  id: string;
  avatar: string;
};

const items: Item[] = names.map(name => ({
  name,
  id: name,
  avatar:
    'https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-react-assets/persona-male.png',
}));

const useStyles = makeStyles({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    columnGap: '16px',
  },
  button: {
    alignSelf: 'center',
  },
  item: {
    cursor: 'pointer',
    ...shorthands.padding('2px', '6px'),
    justifyContent: 'space-between',
  },
  itemSelected: {
    backgroundColor: tokens.colorSubtleBackgroundSelected,
  },
});

// Memoizing the ListItem like this allows the unaffected ListItem not to be re-rendered when the selection changes.
const MyListItem = React.memo(
  ({ name, avatar, ...rest }: React.ComponentProps<typeof ListItem> & { name: string; avatar: string }) => {
    const styles = useStyles();
    return (
      <ListItem key={name} value={name} aria-label={name} {...rest} checkmark={null}>
        <Persona
          name={name}
          secondaryText="Available"
          presence={{ status: 'available' }}
          avatar={{
            image: {
              src: avatar,
            },
          }}
        />
        <Button
          aria-label={`Mute ${name}`}
          size="small"
          icon={<Mic16Regular />}
          className={styles.button}
          onClick={e => {
            e.stopPropagation();
            alert(`Muting ${name}`);
          }}
        />
      </ListItem>
    );
  },
);

export const ListActiveElement = () => {
  const classes = useStyles();

  const [selectedItems, setSelectedItems] = React.useState<SelectionItemId[]>([]);

  const onSelectionChange = React.useCallback((_, data) => {
    setSelectedItems(data.selectedItems);
  }, []);

  const onFocus = React.useCallback(event => {
    // Ignore bubbled up events from the children
    if (event.target !== event.currentTarget) {
      return;
    }
    setSelectedItems([event.target.dataset.value]);
  }, []);

  return (
    <div className={classes.wrapper}>
      <List selectionMode="single" selectedItems={selectedItems} onSelectionChange={onSelectionChange}>
        {items.map(({ name, avatar }) => (
          <MyListItem
            key={name}
            name={name}
            avatar={avatar}
            className={mergeClasses(classes.item, selectedItems.includes(name) && classes.itemSelected)}
            onFocus={onFocus}
          />
        ))}
      </List>
      <div>
        <Text block weight="bold">
          {selectedItems[0]}
        </Text>
        {selectedItems.length ? <Text>{selectedItems[0]} is a great person!</Text> : null}
      </div>
    </div>
  );
};

ListActiveElement.parameters = {
  docs: {
    description: {
      story: [
        'You can use selection and custom styles to show the active element in a different way. This is useful for scenarios where you want to show the details of the selected item, for example.',
        '',
        'In this example, we are also demonstrating how the `onFocus` prop can be utilized to change the selected item immediately upon receiving focus. This allows us to show the details of the selected item in the right panel as user navigates through the list with the keyboard.',
      ].join('\n'),
    },
  },
};
