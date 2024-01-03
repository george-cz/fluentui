import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { useCustomStyleHook_unstable } from '@fluentui/react-shared-contexts';
import { useResizablePanelGroup_unstable } from './useResizablePanelGroup';
import { renderResizablePanelGroup_unstable } from './renderResizablePanelGroup';
import { useResizablePanelGroupStyles_unstable } from './useResizablePanelGroupStyles.styles';
import type { ResizablePanelGroupProps } from './ResizablePanelGroup.types';
import { useResizablePanelGroupContextValues } from './useResizablePanelGroupContextValues';

/**
 * ResizablePanelGroup component - TODO: add more docs
 */
export const ResizablePanelGroup: ForwardRefComponent<ResizablePanelGroupProps> = React.forwardRef((props, ref) => {
  const state = useResizablePanelGroup_unstable(props, ref);

  useResizablePanelGroupStyles_unstable(state);

  useCustomStyleHook_unstable('useResizablePanelGroupStyles_unstable')(state);
  return renderResizablePanelGroup_unstable(state, useResizablePanelGroupContextValues(state));
});

ResizablePanelGroup.displayName = 'ResizablePanelGroup';
