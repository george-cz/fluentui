import * as React from 'react';
import { getIntrinsicElementProps, slot, useMergedRefs } from '@fluentui/react-utilities';
import type { ResizablePanelProps, ResizablePanelState } from './ResizablePanel.types';
import { useResizablePanelGroupContext } from '../../context/resizablePanelsContext';

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
  const { resizeState } = useResizablePanelGroupContext();

  return {
    components: {
      root: 'div',
    },
    root: slot.always(
      getIntrinsicElementProps('div', {
        ref: useMergedRefs(ref, props.panelIndex === 0 ? resizeState.firstPanelRef : resizeState.secondPanelRef),
        ...props,
      }),
      { elementType: 'div' },
    ),
  };
};
