/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { assertSlots } from '@fluentui/react-utilities';
import type { ResizablePanelState, ResizablePanelSlots } from './ResizablePanel.types';

/**
 * Render the final JSX of ResizablePanel
 */
export const renderResizablePanel_unstable = (state: ResizablePanelState) => {
  assertSlots<ResizablePanelSlots>(state);

  // TODO Add additional slots in the appropriate place
  return <state.root />;
};
