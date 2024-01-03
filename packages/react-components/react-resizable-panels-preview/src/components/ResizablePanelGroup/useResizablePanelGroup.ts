import * as React from 'react';
import { getIntrinsicElementProps, slot } from '@fluentui/react-utilities';
import type { ResizablePanelGroupProps, ResizablePanelGroupState } from './ResizablePanelGroup.types';

/**
 * Create the state required to render ResizablePanelGroup.
 *
 * The returned state can be modified with hooks such as useResizablePanelGroupStyles_unstable,
 * before being passed to renderResizablePanelGroup_unstable.
 *
 * @param props - props from this instance of ResizablePanelGroup
 * @param ref - reference to root HTMLDivElement of ResizablePanelGroup
 */
export const useResizablePanelGroup_unstable = (
  props: ResizablePanelGroupProps,
  ref: React.Ref<HTMLDivElement>,
): ResizablePanelGroupState => {
  return {
    // TODO add appropriate props/defaults
    components: {
      // TODO add each slot's element type or component
      root: 'div',
    },
    // TODO add appropriate slots, for example:
    // mySlot: resolveShorthand(props.mySlot),
    root: slot.always(
      getIntrinsicElementProps('div', {
        ref,
        ...props,
      }),
      { elementType: 'div' },
    ),
  };
};
