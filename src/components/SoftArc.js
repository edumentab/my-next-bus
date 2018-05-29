import React from 'react';

const arcStyle = {
  fill: "none",
  stroke: "#0d0",
  strokeWidth: 6,
  strokeLinecap: "round",
};

function pointOnCircle(cx, cy, r, angleInDegrees) {
  let angleInRadians = angleInDegrees / 180 * Math.PI;
  let x = cx + r * Math.sin(angleInRadians);
  let y = cy - r * Math.cos(angleInRadians);
  return `${x},${y}`;
}

export default function SoftArc(props) {
  let startPoint = pointOnCircle(50, 50, 40, props.start);
  let endPoint = pointOnCircle(50, 50, 40, props.end);
  return (
    <svg>
      <path d={
        `M ${startPoint} A 40,40 0 0,1 ${endPoint}`
      } style={arcStyle} />
    </svg>
  );
}