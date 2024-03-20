import { createContext, useContextSelector } from '@fluentui/react-context-selector';
import type { ContextSelector } from '@fluentui/react-context-selector';
import { ListContextValue } from './List.types';

export const listContextDefaultValue: ListContextValue = {
  navigable: false,
  selection: undefined,
  as: undefined,
  accessibilityRoles: {
    listRole: 'list',
    listItemRole: 'listitem',
    setFocusableChildren: () => {
      /* noop */
    },
  },
};

const listContext = createContext<ListContextValue | undefined>(undefined);

export const ListContextProvider = listContext.Provider;

export const useListContext_unstable = <T>(selector: ContextSelector<ListContextValue, T>): T =>
  useContextSelector(listContext, (ctx = listContextDefaultValue) => selector(ctx));
