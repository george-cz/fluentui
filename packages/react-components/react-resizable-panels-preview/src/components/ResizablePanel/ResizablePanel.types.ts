import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

export type ResizablePanelSlots = {
  root: Slot<'div'>;
};

/**
 * ResizablePanel Props
 */
export type ResizablePanelProps = ComponentProps<ResizablePanelSlots> & { panelIndex: number };

/**
 * State used in rendering ResizablePanel
 */
export type ResizablePanelState = ComponentState<ResizablePanelSlots>;
