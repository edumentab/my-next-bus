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

const svgStyle = {
  alignSelf: "center",
  width: "100",
  height: "100",
};

export default function MinuteCount({ minutes }) {
  return (
    <svg style={svgStyle}>
      <circle cx={50} cy={50} r={40} style={filledCircleStyle} />

      <text x={50} y={50} style={textStyle}>{minutes}</text>
    </svg>
  );
}

