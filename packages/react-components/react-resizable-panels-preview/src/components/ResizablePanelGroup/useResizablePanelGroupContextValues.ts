import * as React from 'react';
import { ResizablePanelGroupState, ResizablePanelGroupContextValues } from './ResizablePanelGroup.types';

export function useResizablePanelGroupContextValues(state: ResizablePanelGroupState): ResizablePanelGroupContextValues {
  const { resizeState } = state;

  const panelGroupContext = React.useMemo(
    () => ({
      resizeState,
    }),
    [resizeState],
  );

  return { resizablePanelGroup: panelGroupContext };
}
