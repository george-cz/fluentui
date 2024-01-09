import * as React from 'react';
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';
import { ResizablePanelProps } from '../ResizablePanel/ResizablePanel.types';

export type ResizablePanelGroupSlots = {
  root: Slot<'div'>;
};

/**
 * ResizablePanelGroup Props
 */
export type ResizablePanelGroupProps = ComponentProps<ResizablePanelGroupSlots> & {
  layout?: 'horizontal' | 'vertical';
  state?: ResizablePanelGroupSharedState;
};

export type ResizablePanelGroupSharedState = {
  containerRef: React.Ref<HTMLDivElement>;
  handleRef: React.Ref<HTMLDivElement>;
  firstPanelRef: React.Ref<HTMLDivElement>;
  secondPanelRef: React.Ref<HTMLDivElement>;
};

export type ResizablePanelGroupContextValue = {
  resizeState: ResizablePanelGroupSharedState;
};

export type ResizablePanelGroupContextValues = {
  resizablePanelGroup: ResizablePanelGroupContextValue;
};

/**
 * State used in rendering ResizablePanelGroup
 */
export type ResizablePanelGroupState = ComponentState<ResizablePanelGroupSlots> &
  Pick<ResizablePanelGroupProps, 'layout'> &
  ResizablePanelGroupContextValue;
// TODO: Remove semicolon from previous line, uncomment next line, and provide union of props to pick from ResizablePanelGroupProps.
// & Required<Pick<ResizablePanelGroupProps, 'propName'>>
