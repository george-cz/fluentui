import { NativeTouchOrMouseEvent, getEventClientCoords } from '@fluentui/react-utilities';
import * as React from 'react';
import { useMouseHandler } from './useMouseHandler';

export type UseResizingHandleParams = {
  growDirection: 'right' | 'left' | 'top' | 'bottom';
  variableName: string;
  initialValue: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
};

function limitValue(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min);
}

export const useResizingHandle = (params: UseResizingHandleParams) => {
  const {
    growDirection,
    initialValue,
    variableName,
    minValue = 0,
    maxValue = Number.MAX_SAFE_INTEGER,
    onChange,
  } = params;

  const handleRef = React.useRef<HTMLElement | null>(null);
  const wrapperRef = React.useRef<HTMLElement | null>(null);

  const startCoords = React.useRef({ clientX: 0, clientY: 0 });
  const currentValue = React.useRef(initialValue);
  const commitedValue = React.useRef(initialValue);

  const updateVariableValue = React.useCallback(() => {
    wrapperRef.current?.style.setProperty(variableName, `${currentValue.current}px`);
    onChange?.(currentValue.current);
  }, [onChange, variableName]);

  // In case the maxValue or minValue is changed, we need to make sure we are not exceeding the new limits
  React.useEffect(() => {
    const newValue = limitValue(currentValue.current, minValue, maxValue);
    if (newValue !== currentValue.current) {
      commitedValue.current = currentValue.current = newValue;
      updateVariableValue();
    }
  }, [maxValue, minValue, updateVariableValue]);

  const recalculatePosition = React.useCallback(
    (event: NativeTouchOrMouseEvent) => {
      const { clientX, clientY } = getEventClientCoords(event);
      const deltaCoords = [clientX - startCoords.current.clientX, clientY - startCoords.current.clientY];

      switch (growDirection) {
        case 'right':
          currentValue.current = limitValue(commitedValue.current + deltaCoords[0], minValue, maxValue);
          break;
        case 'left':
          currentValue.current = limitValue(commitedValue.current - deltaCoords[0], minValue, maxValue);
          break;
        case 'top':
          currentValue.current = limitValue(commitedValue.current - deltaCoords[1], minValue, maxValue);
          break;
        case 'bottom':
          currentValue.current = limitValue(commitedValue.current + deltaCoords[1], minValue, maxValue);
          break;
      }

      updateVariableValue();
    },
    [growDirection, maxValue, minValue, updateVariableValue],
  );

  const { attachListeners } = useMouseHandler({
    onDown: (event: NativeTouchOrMouseEvent) => (startCoords.current = getEventClientCoords(event)),
    onMove: recalculatePosition,
    onMoveEnd: () => (commitedValue.current = currentValue.current),
  });

  const setValue = React.useCallback(
    (value: number) => {
      commitedValue.current = currentValue.current = limitValue(value, minValue, maxValue);
      updateVariableValue();
    },
    [maxValue, minValue, updateVariableValue],
  );

  const setHandleRef: React.RefCallback<HTMLElement> = React.useCallback(
    node => {
      if (node) {
        handleRef.current = node;
        attachListeners(node);
      }
    },
    [attachListeners],
  );

  const setWrapperRef: React.RefCallback<HTMLElement> = React.useCallback(
    node => {
      if (node) {
        wrapperRef.current = node;
        updateVariableValue();
      }
    },
    [updateVariableValue],
  );

  return {
    setValue,
    handleRef: setHandleRef,
    wrapperRef: setWrapperRef,
    handleProps: {
      tabIndex: 0,
      role: 'separator',
      'aria-valuemin': minValue,
      'aria-valuemax': maxValue,
      'aria-valuetext': currentValue.current,
    },
  };
};
