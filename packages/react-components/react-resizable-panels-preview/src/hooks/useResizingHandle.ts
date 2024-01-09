import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import {
  NativeTouchOrMouseEvent,
  getEventClientCoords,
  isMouseEvent,
  useEventCallback,
} from '@fluentui/react-utilities';
import * as React from 'react';

export type UseResizingHandleParams = {
  growDirection: 'right' | 'left' | 'top' | 'bottom';
  variableName: string;
  initialValue: number; // value in px or rem
  minValue?: number; // value in px or rem
  maxValue?: number; // value in px or rem
  onChange?: (value: number) => void;
};

function limitValue(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min);
}

export const useResizingHandle = (params: UseResizingHandleParams) => {
  const { growDirection, initialValue, variableName, minValue = 0, maxValue = 99999999, onChange } = params;

  const { targetDocument } = useFluent();
  const globalWin = targetDocument?.defaultView;

  const handleRef = React.useRef(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const startCoords = React.useRef({ clientX: 0, clientY: 0 });
  const latestValue = React.useRef(initialValue);
  const previousValue = React.useRef(initialValue);

  const updateVariableValue = React.useCallback(() => {
    wrapperRef.current?.style.setProperty(variableName, `${latestValue.current}px`);
    onChange?.(latestValue.current);
  }, [onChange, variableName]);

  // In case the maxValue or minValue is changed, we need to make sure that the latestValue is still within the limits.
  React.useEffect(() => {
    const newValue = limitValue(latestValue.current, minValue, maxValue);
    if (newValue !== latestValue.current) {
      latestValue.current = newValue;
      updateVariableValue();
    }
  }, [maxValue, minValue, updateVariableValue]);

  const recalculatePosition = React.useCallback(
    (e: NativeTouchOrMouseEvent) => {
      const { clientX, clientY } = getEventClientCoords(e);

      const deltaCoords = [clientX - startCoords.current.clientX, clientY - startCoords.current.clientY];

      switch (growDirection) {
        case 'right':
          latestValue.current = limitValue(previousValue.current + deltaCoords[0], minValue, maxValue);
          break;
        case 'left':
          latestValue.current = limitValue(previousValue.current - deltaCoords[0], minValue, maxValue);
          break;
        case 'top':
          latestValue.current = limitValue(previousValue.current - deltaCoords[1], minValue, maxValue);
          break;
        case 'bottom':
          latestValue.current = limitValue(previousValue.current + deltaCoords[1], minValue, maxValue);
          break;
      }

      updateVariableValue();
    },
    [growDirection, maxValue, minValue, updateVariableValue],
  );

  const onMouseDown = useEventCallback((e: MouseEvent) => {
    // save mouse location on mouse down
    startCoords.current = getEventClientCoords(e);

    if (isMouseEvent(e)) {
      // ignore other buttons than primary mouse button
      if (e.target !== e.currentTarget || e.button !== 0) {
        return;
      }
      targetDocument?.addEventListener('mouseup', onDragEnd);
      targetDocument?.addEventListener('mousemove', onDrag);
    }
  });

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

  const onDragEnd = useEventCallback((event: NativeTouchOrMouseEvent) => {
    if (isMouseEvent(event)) {
      targetDocument?.removeEventListener('mouseup', onDragEnd);
      targetDocument?.removeEventListener('mousemove', onDrag);
    }

    // Save current value as previous value to be used in next drag
    previousValue.current = latestValue.current;

    // if (isTouchEvent(event)) {
    //   targetDocument?.removeEventListener('touchend', onDragEnd);
    //   targetDocument?.removeEventListener('touchmove', onDrag);
    // }
  });

  const setHandleRef = React.useCallback(
    node => {
      if (node) {
        handleRef.current = node;
        node.addEventListener('mousedown', onMouseDown);
      }
      // TODO is this needed?
      // if (handleRef.current && !node) {
      //   handleRef.current.removeEventListener('mousedown', onMouseDown);
      // }
    },
    [onMouseDown],
  );
  const setWrapperRef = React.useCallback(
    node => {
      if (node) {
        wrapperRef.current = node;
        updateVariableValue();
      }
    },
    [updateVariableValue],
  );

  const setValue = React.useCallback(
    (value: number) => {
      previousValue.current = latestValue.current = limitValue(value, minValue, maxValue);
      updateVariableValue();
    },
    [maxValue, minValue, updateVariableValue],
  );

  return {
    handleRef: setHandleRef,
    wrapperRef: setWrapperRef,
    setValue,
  };
};
