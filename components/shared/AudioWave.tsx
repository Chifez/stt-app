'use client';

import React from 'react';

export const AudioWave = () => {
  return (
    <svg
      width="100"
      height="50"
      viewBox="0 0 100 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        {/* Middle bars */}
        <line x1="10" y1="25" x2="10" y2="25">
          <animate
            attributeName="y1"
            values="25;10;25"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="25;40;25"
            dur="1s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="30" y1="25" x2="30" y2="25">
          <animate
            attributeName="y1"
            values="25;15;25"
            dur="1.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="25;35;25"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="50" y1="25" x2="50" y2="25">
          <animate
            attributeName="y1"
            values="25;5;25"
            dur="0.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="25;45;25"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="70" y1="25" x2="70" y2="25">
          <animate
            attributeName="y1"
            values="25;15;25"
            dur="1.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="25;35;25"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="90" y1="25" x2="90" y2="25">
          <animate
            attributeName="y1"
            values="25;10;25"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="25;40;25"
            dur="1s"
            repeatCount="indefinite"
          />
        </line>
      </g>
    </svg>
  );
};
