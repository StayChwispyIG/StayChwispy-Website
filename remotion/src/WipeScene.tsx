import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Splatter, SplatterSpec } from './Splatter';

const RED = '#ff3b30';
const BLACK = '#050505';
const W = 1920;
const H = 1080;

// tiny deterministic PRNG so cover/reveal share the exact same blob layout
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSpecs(coverDuration: number): SplatterSpec[] {
  const rand = mulberry32(7);
  const specs: SplatterSpec[] = [];
  const cols = 5;
  const rows = 4;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const jitterX = (rand() - 0.5) * (W / cols) * 0.6;
      const jitterY = (rand() - 0.5) * (H / rows) * 0.6;
      const cx = ((col + 0.5) / cols) * W + jitterX;
      const cy = ((row + 0.5) / rows) * H + jitterY;
      const distFromCenter = Math.hypot(cx - W / 2, cy - H / 2) / Math.hypot(W / 2, H / 2);
      specs.push({
        cx,
        cy,
        maxR: Math.max(W / cols, H / rows) * 1.05,
        delay: Math.round(distFromCenter * coverDuration * 0.3 + rand() * 3),
        duration: Math.round(coverDuration * 0.65),
        color: RED,
        wobble: 0.14 + rand() * 0.1,
      });
    }
  }
  return specs;
}

export function WipeScene({ reverse }: { reverse: boolean }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const specs = useMemo(() => buildSpecs(durationInFrames), [durationInFrames]);

  // reveal = play the exact same growth animation backwards
  const effectiveFrame = reverse ? durationInFrames - 1 - frame : frame;

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        {/* black under-layer gives each blob a dark outline, echoing the logo */}
        {specs.map((s, i) => (
          <Splatter
            key={`shadow-${i}`}
            frame={effectiveFrame}
            fps={fps}
            spec={{ ...s, maxR: s.maxR * 1.14, color: BLACK }}
          />
        ))}
        {specs.map((s, i) => (
          <Splatter key={`fill-${i}`} frame={effectiveFrame} fps={fps} spec={s} />
        ))}
      </svg>
    </AbsoluteFill>
  );
}
