import * as React from 'react';
import { useResizingHandle } from '@fluentui/react-resizable-panels-preview';
import { makeResetStyles, useMergedRefs } from '@fluentui/react-components';

const NAV_INITIAL_WIDTH = 80;
const SIDE_INITIAL_WIDTH = 70;

const Handle = React.forwardRef<HTMLDivElement, { position: 'left' | 'right' }>((props, ref) => {
  const { position } = props;
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        ...(position === 'right' ? { right: '-12px' } : { left: '-12px' }),
        top: '50%',
        transform: 'translateY(-50%)',
        width: '8px',
        height: '62px',
        borderRadius: '4px',
        backgroundColor: 'gray',
        cursor: 'ew-resize',
      }}
    />
  );
});

const usePageStyles = makeResetStyles({
  height: '500px',
});

const useMainWrapperStyles = makeResetStyles({
  display: 'grid',
  width: '100%',
  height: '100%',
  gap: '16px',
  gridTemplate: '"nav sub-nav main side" minmax(0, 1fr) / var(--nav-size) 150px 1fr var(--side-size)',
});

const useMainBoxStyles = makeResetStyles({
  borderRadius: '8px',
  backgroundColor: 'lightgray',
  position: 'relative',
});

export const Default = () => {
  const pageStyles = usePageStyles();
  const wrapperStyles = useMainWrapperStyles();
  const boxStyles = useMainBoxStyles();

  const [maxValue, setMaxValue] = React.useState(400);

  const {
    handleRef: navHandleRef,
    wrapperRef: navWrapperRef,
    setValue,
  } = useResizingHandle({
    variableName: '--nav-size',
    growDirection: 'right',
    initialValue: NAV_INITIAL_WIDTH,
    minValue: 30,
    maxValue,
    onChange: (value: number) => {
      console.log('onChange', value);
    },
  });

  const { handleRef: sideHandleRef, wrapperRef: sideWrapperRef } = useResizingHandle({
    variableName: '--side-size',
    growDirection: 'left',
    initialValue: SIDE_INITIAL_WIDTH,
    minValue: 30,
    maxValue: 200,
  });

  const wrapperRef = useMergedRefs(navWrapperRef, sideWrapperRef);

  return (
    <div className={pageStyles}>
      <button onClick={() => setValue(10)}>Set first column to {10}</button>
      <button onClick={() => setValue(100)}>Set first column to {100}</button>
      <button onClick={() => setValue(350)}>Set first column to {350}</button>

      <div className={wrapperStyles} ref={wrapperRef}>
        <div className={boxStyles} style={{ gridArea: 'nav' }}>
          <button onClick={() => setMaxValue(200)}>Set max 200</button>
          <Handle position="right" ref={navHandleRef} />
        </div>
        <div className={boxStyles} style={{ gridArea: 'sub-nav' }} />
        <div className={boxStyles} style={{ gridArea: 'main' }} />
        <div className={boxStyles} style={{ gridArea: 'side' }}>
          <Handle position="left" ref={sideHandleRef} />
        </div>
      </div>
    </div>
  );
};
