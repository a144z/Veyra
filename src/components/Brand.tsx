import { SEAL_HALF } from '../lib/brand';

/** A 26-unit outer circle, an 11-unit counter, and two deliberate release cuts. */
export function Mark({ size = 30, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d={SEAL_HALF} fill={color} />
      <path d={SEAL_HALF} fill={color} transform="translate(64 0) scale(-1 1)" />
    </svg>
  );
}

export function Wordmark() {
  return <span className="wordmark"><Mark />veyra</span>;
}
