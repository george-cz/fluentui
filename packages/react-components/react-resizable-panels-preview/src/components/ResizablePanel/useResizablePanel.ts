import * as React from 'react';
import { getIntrinsicElementProps, slot } from '@fluentui/react-utilities';
import type { ResizablePanelProps, ResizablePanelState } from './ResizablePanel.types';

/**
 * Create the state required to render ResizablePanel.
 *
 * The returned state can be modified with hooks such as useResizablePanelStyles_unstable,
 * before being passed to renderResizablePanel_unstable.
 *
 * @param props - props from this instance of ResizablePanel
 * @param ref - reference to root HTMLDivElement of ResizablePanel
 */
export const useResizablePanel_unstable = (
  props: ResizablePanelProps,
  ref: React.Ref<HTMLDivElement>,
): ResizablePanelState => {
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
