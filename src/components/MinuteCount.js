import React from 'react';

import { filledCircleStyle, textStyle, svgStyle } from '../styles';

export default function MinuteCount({ minutes }) {
  return (
    <svg style={svgStyle}>
      <circle cx={50} cy={50} r={40} style={filledCircleStyle} />

      <text x={50} y={50} style={textStyle}>{minutes}</text>
    </svg>
  );
}

