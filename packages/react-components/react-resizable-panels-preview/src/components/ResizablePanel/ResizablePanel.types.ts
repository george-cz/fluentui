import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type ResizablePanelSlots = {
  root: Slot<'div'>;
};

/**
 * ResizablePanel Props
 */
export type ResizablePanelProps = ComponentProps<ResizablePanelSlots> & {};

/**
 * State used in rendering ResizablePanel
 */
export type ResizablePanelState = ComponentState<ResizablePanelSlots>;
// TODO: Remove semicolon from previous line, uncomment next line, and provide union of props to pick from ResizablePanelProps.
// & Required<Pick<ResizablePanelProps, 'propName'>>
