import { NativeTouchOrMouseEvent, getEventClientCoords } from '@fluentui/react-utilities';
import * as React from 'react';
import { useMouseHandler } from './useMouseHandler';
import { useKeyboardHandler } from './useKeyboardHandler';

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

  const currentValue = React.useRef(initialValue);

  const flushUpdatesToDOM = React.useCallback(() => {
    wrapperRef.current?.style.setProperty(variableName, `${currentValue.current}px`);
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
  }, [getValueText, maxValue, minValue, variableName]);

  // In case the maxValue or minValue is changed, we need to make sure we are not exceeding the new limits
  React.useEffect(() => {
    const newValue = limitValue(currentValue.current, minValue, maxValue);
    if (newValue !== currentValue.current) {
      currentValue.current = newValue;
      flushUpdatesToDOM();
    }
  }, [maxValue, minValue, flushUpdatesToDOM]);

  const setValue = React.useCallback(
    (value: number) => {
      currentValue.current = limitValue(value, minValue, maxValue);
      flushUpdatesToDOM();
    },
    [minValue, maxValue, flushUpdatesToDOM],
  );

  const handleMouseValueChanged = React.useCallback(
    (value: number) => {
      currentValue.current = limitValue(value, minValue, maxValue);
      flushUpdatesToDOM();
    },
    [flushUpdatesToDOM, maxValue, minValue],
  );

  const { attachHandlers: attachMouseHandlers } = useMouseHandler({
    elementRef,
    growDirection,
    onValueChange: handleMouseValueChanged,
  });

  const { attachHandlers: attachKeyboardHandlers } = useKeyboardHandler({
    elementRef,
    growDirection,
    onValueChange: setValue,
  });

  const setHandleRef = React.useCallback(
    node => {
      if (node) {
        handleRef.current = node;
        attachMouseHandlers(node);
        attachKeyboardHandlers(node);
        flushUpdatesToDOM();
      }
    },
    [attachKeyboardHandlers, attachMouseHandlers, flushUpdatesToDOM],
  );

  const setWrapperRef = React.useCallback(
    node => {
      if (node) {
        wrapperRef.current = node;
        flushUpdatesToDOM();
      }
    },
    [flushUpdatesToDOM],
  );

  return {
    setValue,
    elementRef,
    handleRef: setHandleRef,
    wrapperRef: setWrapperRef,
  };
};
