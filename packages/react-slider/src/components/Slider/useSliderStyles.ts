import { shorthands, makeStyles, mergeClasses } from '@fluentui/react-make-styles';
import { createFocusOutlineStyle } from '@fluentui/react-tabster';
import type { SliderState } from './Slider.types';

export const sliderClassName = 'fui-Slider';

const thumbSizeVar = `--fui-slider-thumb-size`;
const railSizeVar = `--fui-slider-rail-size`;
const railColorVar = `--fui-slider-rail-color`;
const progressColorVar = `--fui-slider-progress-color`;
const thumbColorVar = `--fui-slider-thumb-color`;

export const railDirectionVar = `--fui-slider-rail-direction`;
export const railOffsetVar = `--fui-slider-rail-offset`;
export const railProgressVar = `--fui-slider-rail-progress`;
export const railStepsPercentVar = `--fui-slider-rail-steps-percent`;
export const thumbPositionVar = `--fui-slider-thumb-position`;

/**
 * Styles for the root slot
 */
export const useRootStyles = makeStyles({
  root: {
    position: 'relative',
    display: 'inline-grid',
    gridTemplateAreas: '"slider"',
    userSelect: 'none',
    touchAction: 'none',
    alignItems: 'center',
    justifyItems: 'center',
  },

  small: {
    [thumbSizeVar]: '16px',
    [railSizeVar]: '2px',
  },

  medium: {
    [thumbSizeVar]: '20px',
    [railSizeVar]: '4px',
  },

  horizontal: {
    minWidth: '120px',
    height: `var(${thumbSizeVar})`,
  },

  vertical: {
    width: `var(${thumbSizeVar})`,
    minHeight: '120px',
    gridTemplateColumns: `var(${thumbSizeVar})`,
  },

  enabled: theme => ({
    [railColorVar]: theme.colorNeutralStrokeAccessible,
    [progressColorVar]: theme.colorCompoundBrandBackground,
    [thumbColorVar]: theme.colorCompoundBrandBackground,
    ':hover': {
      [thumbColorVar]: theme.colorBrandBackgroundHover,
      [progressColorVar]: theme.colorBrandBackgroundHover,
    },
    ':active': {
      [thumbColorVar]: theme.colorBrandBackgroundPressed,
      [progressColorVar]: theme.colorBrandBackgroundPressed,
    },
  }),

  disabled: theme => ({
    [thumbColorVar]: theme.colorNeutralForegroundDisabled,
    [railColorVar]: theme.colorNeutralBackgroundDisabled,
    [progressColorVar]: theme.colorNeutralForegroundDisabled,
  }),

  focusIndicatorHorizontal: createFocusOutlineStyle({
    selector: 'focus-within',
    style: { outlineOffset: { top: '6px', bottom: '6px', left: '10px', right: '10px' } },
  }),
  focusIndicatorVertical: createFocusOutlineStyle({
    selector: 'focus-within',
    style: { outlineOffset: { top: '10px', bottom: '10px', left: '6px', right: '6px' } },
  }),
});

/**
 * Styles for the rail slot
 */
export const useRailStyles = makeStyles({
  rail: theme => ({
    ...shorthands.borderRadius(theme.borderRadiusXLarge),
    pointerEvents: 'none',
    gridRowStart: 'slider',
    gridRowEnd: 'slider',
    gridColumnStart: 'slider',
    gridColumnEnd: 'slider',
    position: 'relative',
    backgroundImage: `linear-gradient(
      var(${railDirectionVar}),
      var(${railColorVar}) 0%,
      var(${railColorVar}) var(${railOffsetVar}),
      var(${progressColorVar}) var(${railOffsetVar}),
      var(${progressColorVar}) calc(var(${railOffsetVar}) + var(${railProgressVar})),
      var(${railColorVar}) calc(var(${railOffsetVar}) + var(${railProgressVar}))
    )`,
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: theme.colorTransparentStroke,
    ':before': {
      content: "''",
      position: 'absolute',
      backgroundImage: `repeating-linear-gradient(
        var(${railDirectionVar}),
        #0000 0%,
        #0000 calc(var(${railStepsPercentVar}) - 1px),
        ${theme.colorNeutralBackground1} calc(var(${railStepsPercentVar}) - 1px),
        ${theme.colorNeutralBackground1} var(${railStepsPercentVar})
      )`,
    },
  }),

  horizontal: {
    width: '100%',
    height: `var(${railSizeVar})`,
    ':before': {
      left: '-1px',
      right: '-1px',
      height: `var(${railSizeVar})`,
    },
  },

  vertical: {
    width: `var(${railSizeVar})`,
    height: '100%',
    ':before': {
      width: `var(${railSizeVar})`,
      top: '-1px',
      bottom: '1px',
    },
  },
});

/**
 * Styles for the thumb slot
 */
export const useThumbStyles = makeStyles({
  thumb: theme => ({
    position: 'absolute',
    width: `var(${thumbSizeVar})`,
    height: `var(${thumbSizeVar})`,
    pointerEvents: 'none',
    outlineStyle: 'none',
    ...shorthands.borderRadius(theme.borderRadiusCircular),
    boxShadow: `0 0 0 calc(var(${thumbSizeVar}) * .2) ${theme.colorNeutralBackground1} inset`,
    backgroundColor: `var(${thumbColorVar})`,
    transform: 'translateX(-50%)',
    ':before': {
      position: 'absolute',
      top: '0px',
      left: '0px',
      bottom: '0px',
      right: '0px',
      ...shorthands.borderRadius(theme.borderRadiusCircular),
      boxSizing: 'border-box',
      content: "''",
      ...shorthands.border(`calc(var(${thumbSizeVar}) * .05)`, 'solid', theme.colorNeutralStroke1),
    },
  }),
  disabled: theme => ({
    ':before': {
      ...shorthands.border(`calc(var(${thumbSizeVar}) * .05)`, 'solid', theme.colorNeutralForegroundDisabled),
    },
  }),
  horizontal: {
    left: `var(${thumbPositionVar})`,
  },
  vertical: {
    transform: 'translateY(50%)',
    bottom: `var(${thumbPositionVar})`,
  },
});

/**
 * Styles for the Input slot
 */
const useInputStyles = makeStyles({
  input: {
    opacity: 0,
    gridRowStart: 'slider',
    gridRowEnd: 'slider',
    gridColumnStart: 'slider',
    gridColumnEnd: 'slider',
    ...shorthands.padding(0),
    ...shorthands.margin(0),
  },
  horizontal: {
    height: `var(${thumbSizeVar})`,
    width: `calc(100% + var(${thumbSizeVar}))`,
  },
  vertical: {
    height: `calc(100% + var(${thumbSizeVar}))`,
    width: `var(${thumbSizeVar})`,
    '-webkit-appearance': 'slider-vertical',
  },
});

/**
 * Apply styling to the Slider slots based on the state
 */
export const useSliderStyles = (state: SliderState): SliderState => {
  const rootStyles = useRootStyles();
  const railStyles = useRailStyles();
  const thumbStyles = useThumbStyles();
  const inputStyles = useInputStyles();

  state.root.className = mergeClasses(
    sliderClassName,
    rootStyles.root,
    state.vertical ? rootStyles.focusIndicatorVertical : rootStyles.focusIndicatorHorizontal,
    rootStyles[state.size!],
    state.vertical ? rootStyles.vertical : rootStyles.horizontal,
    state.disabled ? rootStyles.disabled : rootStyles.enabled,
    state.root.className,
  );

  state.rail.className = mergeClasses(
    railStyles.rail,
    state.vertical ? railStyles.vertical : railStyles.horizontal,
    state.rail.className,
  );

  state.thumb.className = mergeClasses(
    thumbStyles.thumb,
    state.vertical ? thumbStyles.vertical : thumbStyles.horizontal,
    state.disabled && thumbStyles.disabled,
    state.thumb.className,
  );

  state.input.className = mergeClasses(
    inputStyles.input,
    state.vertical ? inputStyles.vertical : inputStyles.horizontal,
    state.input.className,
  );

  return state;
};
