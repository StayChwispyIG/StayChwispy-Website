import React from 'react';
import { Composition } from 'remotion';
import { WipeScene } from './WipeScene';

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SprayCover"
        component={() => <WipeScene reverse={false} />}
        durationInFrames={22}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SprayReveal"
        component={() => <WipeScene reverse={true} />}
        durationInFrames={22}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
