'use client';

import React from 'react';

interface AudioWaveProps {
  isListening: boolean;
}

export const AudioWave = ({ isListening }: AudioWaveProps) => {
  // Generate 40 x-positions with small gaps
  const xPositions = Array.from({ length: 40 }, (_, i) => 10 + i * 5);

  return (
    <svg
      width="220"
      height="20"
      viewBox="0 0 220 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {xPositions.map((x, i) => {
          // Alternate between shorter and longer lines
          const height = i % 2 === 0 ? 8 : 12;
          return (
            <line
              key={i}
              x1={x}
              y1={10 - height / 2}
              x2={x}
              y2={10 + height / 2}
              className="text-gray-400"
            >
              <animate
                attributeName="y1"
                values={
                  isListening
                    ? `10;${10 - height};10`
                    : `${10 - height / 2};${10 - height / 2};${10 - height / 2}`
                }
                dur={`${0.9 + i * 0.02}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y2"
                values={
                  isListening
                    ? `10;${10 + height};10`
                    : `${10 + height / 2};${10 + height / 2};${10 + height / 2}`
                }
                dur={`${0.9 + i * 0.02}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}
      </g>
    </svg>
  );
};
