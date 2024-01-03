import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type ResizablePanelGroupSlots = {
  root: Slot<'div'>;
};

/**
 * ResizablePanelGroup Props
 */
export type ResizablePanelGroupProps = ComponentProps<ResizablePanelGroupSlots> & {
  layout?: 'horizontal' | 'vertical';
};

export type ResizablePanelGroupContextValue = {
  resizeState: {
    foo: () => void;
  };
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
