/** Cursor motion is relative to the button center; the arrow tip is the transform origin. */
export const CLICK_FRAME = 110;
export const POINTER = { width: 48, height: 60, tipX: 4.5, tipY: 3 } as const;
export function cursorOffset(frame: number) {
  const t = Math.max(0, Math.min(1, (frame - 40) / 60));
  const eased = 1 - Math.pow(1 - t, 3);
  return { x: (1 - eased) * 290, y: (1 - eased) * -310 };
}
