import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import { getEventClientCoords } from '@fluentui/react-utilities';
import { NativeTouchOrMouseEvent, isMouseEvent, isTouchEvent, useEventCallback } from '@fluentui/react-utilities';
import * as React from 'react';

export type UseMouseHandlerParams = {
  onDown?: (event: NativeTouchOrMouseEvent) => void;
  onMove?: (event: NativeTouchOrMouseEvent) => void;
  onMoveEnd?: (event: NativeTouchOrMouseEvent) => void;
  growDirection: 'right' | 'left' | 'top' | 'bottom';
  initialValue: number;
  onValueChange: (value: number) => void;
  elementRef?: React.RefObject<HTMLElement>;
};

export function useMouseHandler(params: UseMouseHandlerParams) {
  const { targetDocument } = useFluent();
  const globalWin = targetDocument?.defaultView;

  const startCoords = React.useRef({ clientX: 0, clientY: 0 });
  const { growDirection, initialValue, onValueChange, elementRef } = params;

  const recalculatePosition = useEventCallback((event: NativeTouchOrMouseEvent) => {
    const { clientX, clientY } = getEventClientCoords(event);
    const deltaCoords = [clientX - startCoords.current.clientX, clientY - startCoords.current.clientY];

    switch (growDirection) {
      case 'right':
        onValueChange(initialValue + deltaCoords[0]);
        break;
      case 'left':
        onValueChange(initialValue - deltaCoords[0]);
        break;
      case 'top':
        onValueChange(initialValue - deltaCoords[1]);
        break;
      case 'bottom':
        onValueChange(initialValue + deltaCoords[1]);
        break;
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
    params.onMoveEnd?.(event);

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

    const elementSize = elementRef?.current?.getBoundingClientRect();
    if (elementSize && initialValue !== elementSize.width) {
      onValueChange(elementSize.width);
    }

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
