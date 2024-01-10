import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import { getEventClientCoords } from '@fluentui/react-utilities';
import { NativeTouchOrMouseEvent, isMouseEvent, isTouchEvent, useEventCallback } from '@fluentui/react-utilities';
import * as React from 'react';

export type UseMouseHandlerParams = {
  onDown?: (event: NativeTouchOrMouseEvent) => void;
  onMove?: (event: NativeTouchOrMouseEvent) => void;
  growDirection: 'right' | 'left' | 'top' | 'bottom';
  onValueChange: (value: number) => void;
  elementRef: React.RefObject<HTMLElement>;
};

export function useMouseHandler(params: UseMouseHandlerParams) {
  const { targetDocument } = useFluent();
  const globalWin = targetDocument?.defaultView;

  const startCoords = React.useRef({ clientX: 0, clientY: 0 });
  const { growDirection, onValueChange, elementRef } = params;

  const key = growDirection === 'right' || growDirection === 'left' ? 'width' : 'height';
  const initialValue = React.useRef(elementRef.current?.getBoundingClientRect()[key] || 0);

  const recalculatePosition = useEventCallback((event: NativeTouchOrMouseEvent) => {
    const { clientX, clientY } = getEventClientCoords(event);
    const deltaCoords = [clientX - startCoords.current.clientX, clientY - startCoords.current.clientY];

    let newValue = initialValue.current;

    switch (growDirection) {
      case 'right':
        newValue += deltaCoords[0];
        break;
      case 'left':
        newValue -= deltaCoords[0];
        break;
      case 'top':
        newValue -= deltaCoords[1];
        break;
      case 'bottom':
        newValue += deltaCoords[1];
        break;
    }

    onValueChange(Math.round(newValue));

    // If, after resize, the element size is different than the value we set, that we have reached the boundary
    // and the element size is controlled by something else (minmax, clamp, max, min css functions etc.)
    // In this case, we need to update the value to the actual element size so that the css var and a11y props
    // reflect the reality.
    const elSize = Math.round(elementRef.current?.getBoundingClientRect()[key] || 0);
    if (elSize !== newValue) {
      onValueChange(elSize);
    }
  });

  const onDrag = useEventCallback((event: NativeTouchOrMouseEvent) => {
    //Using requestAnimationFrame improves performance on slower CPUs
    if (typeof globalWin?.requestAnimationFrame === 'function') {
      requestAnimationFrame(() => recalculatePosition(event));
    } else {
      recalculatePosition(event);
    }
  });

  const onDragEnd = useEventCallback((event: NativeTouchOrMouseEvent) => {
    if (isMouseEvent(event)) {
      targetDocument?.removeEventListener('mouseup', onDragEnd);
      targetDocument?.removeEventListener('mousemove', onDrag);
    }

    if (isTouchEvent(event)) {
      targetDocument?.removeEventListener('touchend', onDragEnd);
      targetDocument?.removeEventListener('touchmove', onDrag);
    }
  });

  const onPointerDown = useEventCallback((event: NativeTouchOrMouseEvent) => {
    startCoords.current = getEventClientCoords(event);
    initialValue.current = elementRef?.current?.getBoundingClientRect().width || 0;

    if (event.defaultPrevented) {
      return;
    }

    if (isMouseEvent(event)) {
      // ignore other buttons than primary mouse button
      if (event.target !== event.currentTarget || event.button !== 0) {
        return;
      }
      targetDocument?.addEventListener('mouseup', onDragEnd);
      targetDocument?.addEventListener('mousemove', onDrag);
    }

    if (isTouchEvent(event)) {
      targetDocument?.addEventListener('touchend', onDragEnd);
      targetDocument?.addEventListener('touchmove', onDrag);
    }
  });

  const attachHandlers = React.useCallback(
    (node: HTMLElement) => {
      node.addEventListener('mousedown', onPointerDown);
      node.addEventListener('touchstart', onPointerDown);
    },
    [onPointerDown],
  );

  return {
    attachHandlers,
  };
}
