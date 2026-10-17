import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLICK_FRAME, POINTER, cursorOffset } from '../video/cursor';

test('cursor arrives at the button center before clicking and stays there throughout the press', () => {
  for (let frame = CLICK_FRAME - 10; frame <= CLICK_FRAME + 20; frame++) {
    assert.deepEqual(cursorOffset(frame), { x: 0, y: -0 });
  }
});

test('pointer tip, not its box center, is anchored at the target', () => {
  assert.equal(3 * POINTER.width / 32 - POINTER.tipX, 0);
  assert.equal(2 * POINTER.height / 40 - POINTER.tipY, 0);
});
