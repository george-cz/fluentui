import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type ResizablePanelHandleSlots = {
  root: Slot<'div'>;
};

/**
 * ResizablePanelHandle Props
 */
export type ResizablePanelHandleProps = ComponentProps<ResizablePanelHandleSlots> & {};

/**
 * State used in rendering ResizablePanelHandle
 */
export type ResizablePanelHandleState = ComponentState<ResizablePanelHandleSlots>;
// TODO: Remove semicolon from previous line, uncomment next line, and provide union of props to pick from ResizablePanelHandleProps.
// & Required<Pick<ResizablePanelHandleProps, 'propName'>>
