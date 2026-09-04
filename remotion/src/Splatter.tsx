import React from 'react';
import { interpolate } from 'remotion';

export type SplatterSpec = {
  cx: number;
  cy: number;
  maxR: number;
  delay: number;
  duration: number;
  color: string;
  wobble: number;
};

/**
 * A single irregular paint blob. The "irregular" edge comes from summing a
 * base circle with a few sine wobbles at different frequencies (cheap fake
 * turbulence that still reads as a spray edge without an SVG filter, so it
 * renders identically across browsers/video encoders).
 */
export function Splatter({
  spec,
  frame,
  fps,
}: {
  spec: SplatterSpec;
  frame: number;
  fps: number;
}) {
  const localFrame = frame - spec.delay;
  if (localFrame < 0) return null;

  const progress = interpolate(localFrame, [0, spec.duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ease-out-expo-ish growth: fast start, settles near the end
  const eased = 1 - Math.pow(1 - progress, 3);
  const r = spec.maxR * eased;
  if (r <= 0) return null;

  const points = 14;
  const path: string[] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wobble =
      1 +
      Math.sin(angle * 3 + spec.cx) * spec.wobble +
      Math.sin(angle * 7 + spec.cy + frame * 0.05) * spec.wobble * 0.5;
    const rr = r * wobble;
    const x = spec.cx + Math.cos(angle) * rr;
    const y = spec.cy + Math.sin(angle) * rr;
    path.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  path.push('Z');

  return <path d={path.join(' ')} fill={spec.color} />;
}
