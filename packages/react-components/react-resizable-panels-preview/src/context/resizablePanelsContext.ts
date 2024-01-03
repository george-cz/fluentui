import * as React from 'react';
import { ResizablePanelGroupContextValue } from '../components/ResizablePanelGroup/ResizablePanelGroup.types';

const resizablePanelsGroupContext = React.createContext<ResizablePanelGroupContextValue | undefined>(undefined);

export const defaultValue: ResizablePanelGroupContextValue = {
  resizeState: {
    foo: () => console.log('undeffffff'),
  },
};

export const ResizablePanelGroupContextProvider = resizablePanelsGroupContext.Provider;
export const useResizablePanelGroupContext = () => React.useContext(resizablePanelsGroupContext) ?? defaultValue;
