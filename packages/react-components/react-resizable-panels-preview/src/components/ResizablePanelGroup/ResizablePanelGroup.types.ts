import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type ResizablePanelGroupSlots = {
  root: Slot<'div'>;
};

/**
 * ResizablePanelGroup Props
 */
export type ResizablePanelGroupProps = ComponentProps<ResizablePanelGroupSlots> & {};

/**
 * State used in rendering ResizablePanelGroup
 */
export type ResizablePanelGroupState = ComponentState<ResizablePanelGroupSlots>;
// TODO: Remove semicolon from previous line, uncomment next line, and provide union of props to pick from ResizablePanelGroupProps.
// & Required<Pick<ResizablePanelGroupProps, 'propName'>>
