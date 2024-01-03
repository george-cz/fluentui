import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { useCustomStyleHook_unstable } from '@fluentui/react-shared-contexts';
import { useResizablePanelGroup_unstable } from './useResizablePanelGroup';
import { renderResizablePanelGroup_unstable } from './renderResizablePanelGroup';
import { useResizablePanelGroupStyles_unstable } from './useResizablePanelGroupStyles.styles';
import type { ResizablePanelGroupProps } from './ResizablePanelGroup.types';

/**
 * ResizablePanelGroup component - TODO: add more docs
 */
export const ResizablePanelGroup: ForwardRefComponent<ResizablePanelGroupProps> = React.forwardRef((props, ref) => {
  const state = useResizablePanelGroup_unstable(props, ref);

  useResizablePanelGroupStyles_unstable(state);
  // TODO update types in packages/react-components/react-shared-contexts/src/CustomStyleHooksContext/CustomStyleHooksContext.ts
  // https://github.com/microsoft/fluentui/blob/master/rfcs/react-components/convergence/custom-styling.md
  useCustomStyleHook_unstable('useResizablePanelGroupStyles_unstable')(state);
  return renderResizablePanelGroup_unstable(state);
});

ResizablePanelGroup.displayName = 'ResizablePanelGroup';
