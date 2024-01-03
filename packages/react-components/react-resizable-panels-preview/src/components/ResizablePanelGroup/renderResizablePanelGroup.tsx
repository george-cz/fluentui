/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { assertSlots } from '@fluentui/react-utilities';
import type { ResizablePanelGroupState, ResizablePanelGroupSlots } from './ResizablePanelGroup.types';

/**
 * Render the final JSX of ResizablePanelGroup
 */
export const renderResizablePanelGroup_unstable = (state: ResizablePanelGroupState) => {
  assertSlots<ResizablePanelGroupSlots>(state);

  // TODO Add additional slots in the appropriate place
  return <state.root />;
};
