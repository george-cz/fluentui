import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { useCustomStyleHook_unstable } from '@fluentui/react-shared-contexts';
import { useResizablePanelHandle_unstable } from './useResizablePanelHandle';
import { renderResizablePanelHandle_unstable } from './renderResizablePanelHandle';
import { useResizablePanelHandleStyles_unstable } from './useResizablePanelHandleStyles.styles';
import type { ResizablePanelHandleProps } from './ResizablePanelHandle.types';

/**
 * ResizablePanelHandle component - TODO: add more docs
 */
export const ResizablePanelHandle: ForwardRefComponent<ResizablePanelHandleProps> = React.forwardRef((props, ref) => {
  const state = useResizablePanelHandle_unstable(props, ref);

  useResizablePanelHandleStyles_unstable(state);
  // TODO update types in packages/react-components/react-shared-contexts/src/CustomStyleHooksContext/CustomStyleHooksContext.ts
  // https://github.com/microsoft/fluentui/blob/master/rfcs/react-components/convergence/custom-styling.md
  useCustomStyleHook_unstable('useResizablePanelHandleStyles_unstable')(state);
  return renderResizablePanelHandle_unstable(state);
});

ResizablePanelHandle.displayName = 'ResizablePanelHandle';
