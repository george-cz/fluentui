/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { assertSlots } from '@fluentui/react-utilities';
import type {
  ResizablePanelGroupState,
  ResizablePanelGroupSlots,
  ResizablePanelGroupContextValues,
} from './ResizablePanelGroup.types';
import { ResizablePanelGroupContextProvider } from '../../context/resizablePanelsContext';

/**
 * Render the final JSX of ResizablePanelGroup
 */
export const renderResizablePanelGroup_unstable = (
  state: ResizablePanelGroupState,
  contextValues: ResizablePanelGroupContextValues,
) => {
  assertSlots<ResizablePanelGroupSlots>(state);

  // TODO Add additional slots in the appropriate place
  return (
    <ResizablePanelGroupContextProvider value={contextValues.resizablePanelGroup}>
      <state.root />
    </ResizablePanelGroupContextProvider>
  );
};
