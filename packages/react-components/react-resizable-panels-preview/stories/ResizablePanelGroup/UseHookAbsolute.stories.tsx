import * as React from 'react';
import {
  ResizablePanelGroup,
  ResizablePanelHandle,
  useResizablePanelGroupSharedState,
} from '@fluentui/react-resizable-panels-preview';
import { makeStyles, mergeClasses } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
  },
  panel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel1: {
    minWidth: '100px',
  },
});

const LeftPanelComponent = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      Left {count}
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
};

export const UseHookAbsolute = () => {
  const styles = useStyles();
  const resizeState = useResizablePanelGroupSharedState({ defaultSizes: [30, 70], constraints: [5, 85] });
  const [count, setCount] = React.useState(0);

  return (
    <>
      <div>
        Does it reset when rerender? {count}
        <button onClick={() => setCount(c => c + 1)}>Add</button>
      </div>
      <div className={styles.container} ref={resizeState.containerRef}>
        <div className={mergeClasses(styles.panel, styles.panel1)} ref={resizeState.secondPanelRef}>
          <LeftPanelComponent />
        </div>
        <div ref={resizeState.handleRef}>&lt;|&gt;</div>
        <div className={styles.panel} ref={resizeState.firstPanelRef}>
          Right Panel
        </div>
      </div>
    </>
  );
};
