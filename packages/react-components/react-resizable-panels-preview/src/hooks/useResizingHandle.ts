import { NativeTouchOrMouseEvent, getEventClientCoords, useEventCallback } from '@fluentui/react-utilities';
import * as React from 'react';
import { useMouseHandler } from './useMouseHandler';
import { getCode, keyboardKey } from '@fluentui/accessibility';

export type UseResizingHandleParams = {
  growDirection: 'right' | 'left' | 'top' | 'bottom';
  variableName: string;
  initialValue: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
  getValueText?: (value: number) => string;
};

function limitValue(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min);
}

type UseKeyboardHandlerOptions = {
  value: number;
  onValueChange: (value: number) => void;
};

const useKeyboardHandler = (options: UseKeyboardHandlerOptions) => {
  const { value, onValueChange } = options;

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (getCode(event) === keyboardKey.ArrowRight) {
      onValueChange(value + 20);
    }
    if (getCode(event) === keyboardKey.ArrowLeft) {
      onValueChange(value - 20);
    }
  });

  const attachHandlers = React.useCallback(
    (node: HTMLElement) => {
      node.addEventListener('keydown', onKeyDown);
    },
    [onKeyDown],
  );

  return {
    attachHandlers,
  };
};

export const useResizingHandle = (params: UseResizingHandleParams) => {
  const {
    growDirection,
    initialValue,
    variableName,
    minValue = 0,
    maxValue = Number.MAX_SAFE_INTEGER,
    onChange,
    getValueText = value => `${value.toFixed(0)}px`,
  } = params;

  const handleRef = React.useRef<HTMLElement | null>(null);
  const wrapperRef = React.useRef<HTMLElement | null>(null);
  const elementRef = React.useRef<HTMLElement | null>(null);

  const startCoords = React.useRef({ clientX: 0, clientY: 0 });
  const currentValue = React.useRef(initialValue);
  const commitedValue = React.useRef(initialValue);

  const updateVariableValue = React.useCallback(() => {
    wrapperRef.current?.style.setProperty(variableName, `${currentValue.current}px`);
    onChange?.(currentValue.current);
  }, [onChange, variableName]);

  const updateProps = React.useCallback(() => {
    const handleProps = {
      tabIndex: 0,
      role: 'separator',
      'aria-valuemin': minValue,
      'aria-valuemax': maxValue,
      'aria-valuetext': getValueText(currentValue.current),
    };

    Object.entries(handleProps).forEach(([key, value]) => {
      handleRef.current?.setAttribute(key, String(value));
    });
  }, [getValueText, maxValue, minValue]);

  const commitValue = React.useCallback(() => {
    commitedValue.current = currentValue.current;

    // Measure the final element size, if its different than the current value, that means the element size
    // is controlled by another aspect than just straight up pixel value (could be minmax, clamp, max, min css functions
    // etc. If this is the case, commit the actual element size to the value, so that next time the handle is dragged,
    // it will start from the correct position.

    const elementSize = elementRef.current?.getBoundingClientRect();
    if (elementSize && commitedValue.current !== elementSize.width) {
      commitedValue.current = currentValue.current = elementSize.width;
      updateVariableValue();
    }

    updateProps();
  }, [updateProps, updateVariableValue]);

  // In case the maxValue or minValue is changed, we need to make sure we are not exceeding the new limits
  React.useEffect(() => {
    const newValue = limitValue(currentValue.current, minValue, maxValue);
    if (newValue !== currentValue.current) {
      commitedValue.current = currentValue.current = newValue;
      updateVariableValue();
      commitValue();
    }
  }, [commitValue, maxValue, minValue, updateVariableValue]);

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

  const setValue = React.useCallback(
    (value: number) => {
      commitedValue.current = currentValue.current = limitValue(value, minValue, maxValue);
      updateVariableValue();
      commitValue();
    },
    [commitValue, maxValue, minValue, updateVariableValue],
  );

  const { attachHandlers: attachMouseHandlers } = useMouseHandler({
    onDown: (event: NativeTouchOrMouseEvent) => (startCoords.current = getEventClientCoords(event)),
    onMove: recalculatePosition,
    onMoveEnd: commitValue,
  });

  const { attachHandlers: attachKeyboardHandlers } = useKeyboardHandler({
    value: currentValue.current,
    onValueChange: setValue,
  });

  const setHandleRef = React.useCallback(
    node => {
      if (node) {
        handleRef.current = node;
        attachMouseHandlers(node);
        attachKeyboardHandlers(node);
        updateProps();
      }
    },
    [attachKeyboardHandlers, attachMouseHandlers, updateProps],
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

  return {
    setValue,
    elementRef,
    handleRef: setHandleRef,
    wrapperRef: setWrapperRef,
  };
};
