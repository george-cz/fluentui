import * as React from 'react';
import { NativeTouchOrMouseEvent, getEventClientCoords, isMouseEvent } from '@fluentui/react-utilities';
import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import type { ResizablePanelGroupSharedState } from '../components/ResizablePanelGroup/ResizablePanelGroup.types';

export type ResizablePanelGroupSharedStateOptions = {
  defaultSizes?: [number, number];
  constraints?: [number, number];
};

function calculatePosMultiplier(first: React.RefObject<HTMLDivElement>, second: React.RefObject<HTMLDivElement>) {
  if (first?.current && second?.current) {
    const result = first.current.compareDocumentPosition(second.current);
    //eslint-disable-next-line no-bitwise
    if (result & Node.DOCUMENT_POSITION_FOLLOWING) {
      return 0; // first is before second
      //eslint-disable-next-line no-bitwise
    } else if (result & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1; // second is before first
    }
  }
  return 0; // default to first is before second
}

export function useResizablePanelGroupSharedState(
  options: ResizablePanelGroupSharedStateOptions = {},
): ResizablePanelGroupSharedState {
  const { targetDocument } = useFluent();
  const globalWin = targetDocument?.defaultView;

  const { defaultSizes = [50, 50], constraints = [0, 100] } = options;

  const leftSize = '150px';

  // decides if the percentage is calculated from the left or right side of the handle, 0 or 1

  const containerWidth = React.useRef(0);
  const handleWidth = React.useRef(0);
  const mouseStartX = React.useRef(0);
  const handleLeftXCoord = React.useRef(0);
  const containerLeftXCoord = React.useRef(0);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const firstPanelRef = React.useRef<HTMLDivElement | null>(null);
  const handleRef = React.useRef<HTMLDivElement | null>(null);
  const secondPanelRef = React.useRef<HTMLDivElement | null>(null);

  const firstPanelSizePercent = React.useRef(typeof defaultSizes[0] === 'number' ? defaultSizes[0] : undefined);
  const firstPanelSizePx = React.useRef(defaultSizes[0]);

  //

  const updatePanelSizes = React.useCallback(() => {
    if (!firstPanelSizePercent.current && containerRef.current && firstPanelRef.current && handleRef.current) {
      firstPanelSizePercent.current =
        (parseInt(defaultSizes[0]) /
          (containerRef.current.getBoundingClientRect().width - handleRef.current.getBoundingClientRect().width)) *
        100;
    }

    firstPanelRef.current?.style.setProperty('flex', `${firstPanelSizePercent.current} 1`);
    secondPanelRef.current?.style.setProperty('flex', `${100 - firstPanelSizePercent.current} 1`);
  }, []);

  const recalculatePosition = React.useCallback(
    (e: NativeTouchOrMouseEvent) => {
      const positioningMultiplier = calculatePosMultiplier(firstPanelRef, secondPanelRef);

      const { clientX } = getEventClientCoords(e);
      const dx = clientX - mouseStartX.current;

      // Calculate new handle position, dx is accumulative since the dragging started
      const newHandlePos = handleLeftXCoord.current + dx;
      // subtract the handle width from the container width to offset the effect of the handle width
      // get the relative position of handle to the container by subtracting the container's left x coordinate
      // calculate the percentage by dividing the relative position of handle to the container by the container
      const percentage =
        ((newHandlePos - containerLeftXCoord.current) / (containerWidth.current - handleWidth.current)) * 100;

      console.log(percentage);

      const sizeInPx = (percentage / 100) * containerWidth.current;

      firstPanelSizePercent.current = Math.min(Math.max(percentage, constraints[0]), constraints[1]);
      firstPanelSizePx.current = Math.min(Math.max(sizeInPx, constraints[0]), constraints[1]);

      updatePanelSizes();
    },
    [constraints, updatePanelSizes],
  );

  const onDrag = React.useCallback(
    (e: NativeTouchOrMouseEvent) => {
      //Using requestAnimationFrame improves performance on slower CPUs
      if (typeof globalWin?.requestAnimationFrame === 'function') {
        requestAnimationFrame(() => recalculatePosition(e));
      } else {
        recalculatePosition(e);
      }
    },
    [globalWin?.requestAnimationFrame, recalculatePosition],
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

  const onMouseDown = (e: MouseEvent) => {
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

  const setHandleRef: React.RefCallback<HTMLDivElement> = el => {
    if (!el) {
      return;
    }
    el.addEventListener('mousedown', onMouseDown);
    handleRef.current = el;
    updatePanelSizes();
  };

  const setContainerRef = React.useCallback(
    el => {
      if (!el) {
        return;
      }
      containerRef.current = el;
      updatePanelSizes();
    },
    [updatePanelSizes],
  );

  const setFirstPanelRef = React.useCallback(
    el => {
      if (!el) {
        return;
      }
      firstPanelRef.current = el;
      updatePanelSizes();
    },
    [updatePanelSizes],
  );

  const setSecondPanelRef = React.useCallback(
    el => {
      if (!el) {
        return;
      }
      secondPanelRef.current = el;
      updatePanelSizes();
    },
    [updatePanelSizes],
  );

  return {
    containerRef: setContainerRef,
    handleRef: setHandleRef,
    firstPanelRef: setFirstPanelRef,
    secondPanelRef: setSecondPanelRef,
  };
}
