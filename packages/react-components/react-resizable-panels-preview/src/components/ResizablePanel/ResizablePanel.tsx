import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { useCustomStyleHook_unstable } from '@fluentui/react-shared-contexts';
import { useResizablePanel_unstable } from './useResizablePanel';
import { renderResizablePanel_unstable } from './renderResizablePanel';
import { useResizablePanelStyles_unstable } from './useResizablePanelStyles.styles';
import type { ResizablePanelProps } from './ResizablePanel.types';

/**
 * ResizablePanel component - TODO: add more docs
 */
export const ResizablePanel: ForwardRefComponent<ResizablePanelProps> = React.forwardRef((props, ref) => {
  const state = useResizablePanel_unstable(props, ref);

  useResizablePanelStyles_unstable(state);
  // TODO update types in packages/react-components/react-shared-contexts/src/CustomStyleHooksContext/CustomStyleHooksContext.ts
  // https://github.com/microsoft/fluentui/blob/master/rfcs/react-components/convergence/custom-styling.md
  useCustomStyleHook_unstable('useResizablePanelStyles_unstable')(state);
  return renderResizablePanel_unstable(state);
});

ResizablePanel.displayName = 'ResizablePanel';
