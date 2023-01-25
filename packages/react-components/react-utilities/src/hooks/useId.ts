import * as React from 'react';
import { defaultSSRContextValue, useSSRContext } from '../ssr/index';

/**
 * Resets generated IDs, should be used only in tests.
 */
export function resetIdsForTests(): void {
  defaultSSRContextValue.current = 0;
}

/**
 * Hook to generate a unique ID.
 *
 * @param prefix - Optional prefix for the ID. Defaults to 'fui-'.
 * @param providedId - Optional id provided by a parent component. Defaults to the provided value if present,
 *  without conditioning the hook call
 * @returns The ID
 */
export function useId(prefix: string = 'fui-', providedId?: string): string {
  const contextValue = useSSRContext();

  // Checking if useId is available on React, if it is, we use it to generate the id. String concatenation is used to
  // prevent bundlers from complaining with older versions of React.
  const _useId: () => string | undefined = (React as never)['use' + 'Id'];

  if (_useId) {
    return providedId || `${prefix}${_useId()}`;
  }

  // Hooks appear to be running conditionally, but they will always run in the same order since it's based on
  // the version of React being used. This is safe to ignore.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useMemo(() => {
    if (providedId) {
      return providedId;
    }

    return `${prefix}${++contextValue.current}`;
  }, [prefix, providedId, contextValue]);
}
