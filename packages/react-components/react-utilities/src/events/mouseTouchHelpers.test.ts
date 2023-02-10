import { getEventClientCoords, isMouseEvent, isTouchEvent } from './mouseTouchHelpers';

const touchEvents = ['touchstart', 'touchend', 'touchmove', 'touchcancel'];
const mouseEvents = [
  'click',
  'contextmenu',
  'dblclick',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
];

describe('mouseTouchHelpers', () => {
  describe('isTouchEvent', () => {
    touchEvents.forEach(ev =>
      it(`Touch: ${ev} returns true`, () => {
        expect(isTouchEvent(new Event(ev) as any)).toBe(true);
      }),
    );

    mouseEvents.forEach(ev =>
      it(`Mouse: ${ev} returns false`, () => {
        expect(isTouchEvent(new Event(ev) as any)).toBe(false);
      }),
    );

    it(`Random event returns false`, () => {
      expect(isTouchEvent(new Event('foo') as any)).toBe(false);
    });
  });

  describe('isMouseEvent', () => {
    touchEvents.forEach(ev =>
      it(`Touch: ${ev} returns true`, () => {
        expect(isMouseEvent(new Event(ev) as any)).toBe(false);
      }),
    );
    mouseEvents.forEach(ev =>
      it(`Mouse: ${ev} returns true`, () => {
        expect(isMouseEvent(new Event(ev) as any)).toBe(true);
      }),
    );

    it(`Random event returns false`, () => {
      expect(isMouseEvent(new Event('foo') as any)).toBe(false);
    });
  });

  describe('getEventClientCoords', () => {
    touchEvents.forEach(ev =>
      it(`Touch: ${ev} returns proper coordinates`, () => {
        const event = new TouchEvent(ev, { touches: [{ clientX: 5, clientY: 10 } as any] }) as any;
        expect(getEventClientCoords(event)).toEqual({ clientX: 5, clientY: 10 });
      }),
    );
    mouseEvents.forEach(ev =>
      it(`Mouse: ${ev} returns proper coordinates`, () => {
        const event = new MouseEvent(ev, { clientX: 5, clientY: 10 }) as any;
        expect(getEventClientCoords(event)).toEqual({ clientX: 5, clientY: 10 });
      }),
    );

    it('Random event throws Error outside of prod', () => {
      const event = new Event('Hello') as any;
      expect(() => getEventClientCoords(event)).toThrow();
    });

    it('Random event returns zeroes in prod and doesnt throw error', () => {
      const event = new Event('Hello') as any;
      process.env.NODE_ENV = 'production';
      expect(() => getEventClientCoords(event)).not.toThrow();
      expect(getEventClientCoords(event)).toEqual({ clientX: 0, clientY: 0 });
    });
  });
});
