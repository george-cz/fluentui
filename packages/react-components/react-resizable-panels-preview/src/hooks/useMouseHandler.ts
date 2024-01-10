import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import { NativeTouchOrMouseEvent, isMouseEvent, isTouchEvent, useEventCallback } from '@fluentui/react-utilities';
import * as React from 'react';

export type UseMouseHandlerParams = {
  onDown?: (event: NativeTouchOrMouseEvent) => void;
  onMove?: (event: NativeTouchOrMouseEvent) => void;
  onMoveEnd?: (event: NativeTouchOrMouseEvent) => void;
};

export function useMouseHandler(params: UseMouseHandlerParams = {}) {
  const { targetDocument } = useFluent();
  const globalWin = targetDocument?.defaultView;

  const onDrag = useEventCallback((event: NativeTouchOrMouseEvent) => {
    //Using requestAnimationFrame improves performance on slower CPUs
    if (typeof globalWin?.requestAnimationFrame === 'function') {
      requestAnimationFrame(() => params.onMove?.(event));
    } else {
      params.onMove?.(event);
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
    params.onDown?.(event);

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
