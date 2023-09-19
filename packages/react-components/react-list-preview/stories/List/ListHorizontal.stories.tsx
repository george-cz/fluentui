import * as React from 'react';
import { List, ListItem, ListLayout } from '@fluentui/react-list-preview';
import { makeStyles, shorthands } from '@griffel/react';

const useStyles = makeStyles({
  listItem: {
    ...shorthands.padding('4px'),
  },
});

export const ListHorizontal = () => {
  const classes = useStyles();
  return (
    <List layout={ListLayout.Horizontal} focusableItems>
      <ListItem className={classes.listItem}>Asia</ListItem>
      <ListItem className={classes.listItem}>Africa</ListItem>
      <ListItem className={classes.listItem}>Europe</ListItem>
      <ListItem className={classes.listItem}>North America</ListItem>
      <ListItem className={classes.listItem}>South America</ListItem>
      <ListItem className={classes.listItem}>Australia/Oceania</ListItem>
      <ListItem className={classes.listItem}>Antarctica</ListItem>
    </List>
  );
};
