import * as React from 'react';
import { NativeTouchOrMouseEvent, getEventClientCoords, isMouseEvent } from '@fluentui/react-utilities';
import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import type { ResizablePanelGroupSharedState } from '../components/ResizablePanelGroup/ResizablePanelGroup.types';
import { ResizablePanelProps } from '../components/ResizablePanel/ResizablePanel.types';

export function useResizablePanelGroupSharedState(): ResizablePanelGroupSharedState {
  const { targetDocument } = useFluent();

  const containerWidth = React.useRef(0);
  const handleWidth = React.useRef(0);
  const mouseStartX = React.useRef(0);
  const handleLeftXCoord = React.useRef(0);
  const containerLeftXCoord = React.useRef(0);

  // percentage
  const [leftPanelPercentWidth, setLeftPanelPercentWidth] = React.useState(50);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLDivElement>(null);

  const recalculatePosition = React.useCallback((e: NativeTouchOrMouseEvent) => {
    const { clientX } = getEventClientCoords(e);
    const dx = clientX - mouseStartX.current;

    // Calculate new handle position, dx is accumulative since the dragging started
    const newHandlePos = handleLeftXCoord.current + dx;
    // subtract the handle width from the container width to offset the effect of the handle width
    // get the relative position of handle to the container by subtracting the container's left x coordinate
    // calculate the percentage by dividing the relative position of handle to the container by the container
    const percentage =
      ((newHandlePos - containerLeftXCoord.current) / (containerWidth.current - handleWidth.current)) * 100;

    setLeftPanelPercentWidth(Math.min(Math.max(percentage, 0), 100));
  }, []);

  const onDrag = React.useCallback(
    (e: NativeTouchOrMouseEvent) => {
      // Using requestAnimationFrame here drastically improves resizing experience on slower CPUs
      // if (typeof globalWin?.requestAnimationFrame === 'function') {
      //   requestAnimationFrame(() => recalculatePosition(e));
      // } else {
      recalculatePosition(e);
      // }
    },
    // [globalWin?.requestAnimationFrame, recalculatePosition],
    [recalculatePosition],
  );

  const onDragEnd = React.useCallback(
    (event: NativeTouchOrMouseEvent) => {
      if (isMouseEvent(event)) {
        targetDocument?.removeEventListener('mouseup', onDragEnd);
        targetDocument?.removeEventListener('mousemove', onDrag);
      }
      // if (isTouchEvent(event)) {
      //   targetDocument?.removeEventListener('touchend', onDragEnd);
      //   targetDocument?.removeEventListener('touchmove', onDrag);
      // }
    },
    [onDrag, targetDocument],
  );

  const getOnMouseDown = () => (e: React.MouseEvent) => {
    // save mouse location on mouse down
    mouseStartX.current = getEventClientCoords(e).clientX;

    // Measure both container and handle width to use in calculations of percentages later
    containerWidth.current = containerRef.current?.getBoundingClientRect().width || 1;
    handleWidth.current = handleRef.current?.getBoundingClientRect().width || 1;

    // Save both container and handle left x coordinates to use in calculations of percentages later
    handleLeftXCoord.current = handleRef.current?.getBoundingClientRect()?.x || 0;
    containerLeftXCoord.current = containerRef.current?.getBoundingClientRect()?.x || 0;

    if (isMouseEvent(e)) {
      // ignore other buttons than primary mouse button
      if (e.target !== e.currentTarget || e.button !== 0) {
        return;
      }
      targetDocument?.addEventListener('mouseup', onDragEnd);
      targetDocument?.addEventListener('mousemove', onDrag);
    }
  };

  const widths = [leftPanelPercentWidth, 100 - leftPanelPercentWidth];

  return {
    getPanelProps: (panelIndex: number, props: ResizablePanelProps = {}) => ({
      ...props,
      style: { ...props.style, flex: `${widths[panelIndex]} 1` },
    }),
    getOnMouseDown,
    containerRef,
    handleRef,
  };
}
