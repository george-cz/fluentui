import * as React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizablePanelHandle } from '@fluentui/react-resizable-panels-preview';

export const Default = () => (
  <ResizablePanelGroup>
    <ResizablePanel panelIndex={0}>Left Panel</ResizablePanel>
    <ResizablePanelHandle />
    <ResizablePanel panelIndex={1}>Right Panel</ResizablePanel>
  </ResizablePanelGroup>
);
