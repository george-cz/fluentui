import * as React from 'react';
import {
  ResizablePanelGroup,
  ResizablePanelHandle,
  useResizablePanelGroupSharedState,
} from '@fluentui/react-resizable-panels-preview';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  panel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const UseHook = () => {
  const styles = useStyles();
  const resizeState = useResizablePanelGroupSharedState();

  return (
    <ResizablePanelGroup state={resizeState}>
      <div className={styles.panel} {...resizeState.getPanelProps(0)}>
        Left Panel
      </div>
      <ResizablePanelHandle />
      <div className={styles.panel} {...resizeState.getPanelProps(1)}>
        Right Panel
      </div>
    </ResizablePanelGroup>
  );
};
