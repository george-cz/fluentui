import * as React from 'react';
import { getIntrinsicElementProps, slot, useMergedRefs } from '@fluentui/react-utilities';
import type { ResizablePanelGroupProps, ResizablePanelGroupState } from './ResizablePanelGroup.types';
import { useResizablePanelGroupSharedState } from '../../hooks/useResizablePanelGroupSharedState';

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
  const { layout = 'horizontal' } = props;

  const resizeStateInternal = useResizablePanelGroupSharedState();
  const resizeState = props.state ?? resizeStateInternal;

  return {
    layout,
    components: {
      root: 'div',
    },
    root: slot.always(
      getIntrinsicElementProps('div', {
        ref: useMergedRefs(ref, resizeState.containerRef),
        ...props,
      }),
      { elementType: 'div' },
    ),

    resizeState,
  };
};
