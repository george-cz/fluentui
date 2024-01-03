import * as React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizablePanelHandle } from '@fluentui/react-resizable-panels-preview';

export const Default = () => (
  <div>
    <ResizablePanelGroup>
      <ResizablePanel>dd</ResizablePanel>
      <ResizablePanelHandle />
      <ResizablePanel>ddd</ResizablePanel>
    </ResizablePanelGroup>
    <hr></hr>

    <div style={{ display: 'flex', height: '300px' }}>
      <ResizablePanelGroup layout="vertical">
        <ResizablePanel>dd</ResizablePanel>
        <ResizablePanelHandle />
        <ResizablePanel>ddd</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </div>
);
