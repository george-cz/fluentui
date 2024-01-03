import * as React from 'react';
import { getIntrinsicElementProps, slot } from '@fluentui/react-utilities';
import type { ResizablePanelHandleProps, ResizablePanelHandleState } from './ResizablePanelHandle.types';

/**
 * Create the state required to render ResizablePanelHandle.
 *
 * The returned state can be modified with hooks such as useResizablePanelHandleStyles_unstable,
 * before being passed to renderResizablePanelHandle_unstable.
 *
 * @param props - props from this instance of ResizablePanelHandle
 * @param ref - reference to root HTMLDivElement of ResizablePanelHandle
 */
export const useResizablePanelHandle_unstable = (
  props: ResizablePanelHandleProps,
  ref: React.Ref<HTMLDivElement>,
): ResizablePanelHandleState => {
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
