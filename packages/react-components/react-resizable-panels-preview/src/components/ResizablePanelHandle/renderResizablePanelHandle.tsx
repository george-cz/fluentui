/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { assertSlots } from '@fluentui/react-utilities';
import type { ResizablePanelHandleState, ResizablePanelHandleSlots } from './ResizablePanelHandle.types';

/**
 * Render the final JSX of ResizablePanelHandle
 */
export const renderResizablePanelHandle_unstable = (state: ResizablePanelHandleState) => {
  assertSlots<ResizablePanelHandleSlots>(state);

  // TODO Add additional slots in the appropriate place
  return <state.root />;
};
