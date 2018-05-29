import React from 'react';

const filledCircleStyle = {
  fill: "#eee",
  stroke: "#eee",
  strokeWidth: 6,
};

const textStyle = {
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: "48px",
};

export default function MinuteCount({ minutes }) {
  return (
    <svg>
      <circle cx={50} cy={50} r={40} style={filledCircleStyle} />

      <text x={50} y={50} style={textStyle}>{minutes}</text>
    </svg>
  );
}

