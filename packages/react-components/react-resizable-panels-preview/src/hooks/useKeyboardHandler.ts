import { useEventCallback } from '@fluentui/react-utilities';
import * as React from 'react';
import { getCode, keyboardKey } from '@fluentui/accessibility';

export type UseKeyboardHandlerOptions = {
  value: number;
  onValueChange: (value: number) => void;
};

export const useKeyboardHandler = (options: UseKeyboardHandlerOptions) => {
  const { value, onValueChange } = options;

  const onKeyDown = useEventCallback((event: KeyboardEvent) => {
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
