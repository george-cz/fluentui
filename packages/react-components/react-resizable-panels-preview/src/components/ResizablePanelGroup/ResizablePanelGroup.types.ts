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
  getPanelProps: (panelIndex: number, props?: ResizablePanelProps) => ResizablePanelProps;
  getOnMouseDown: () => (e: React.MouseEvent) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  handleRef: React.RefObject<HTMLDivElement>;
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
