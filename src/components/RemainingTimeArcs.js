import React from 'react';

import SoftArc from './SoftArc.js';

const circleStyle = {
  fill: "none",
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

function interpolate(lowA, highA, lowB, highB, b) {
  return (b - lowB) / (highB - lowB) * (highA - lowA) + lowA;
}

function clampAbove(value, upperLimit) {
  return Math.min(value, upperLimit);
}

const fudge = 5;

export default function RemainingTimeArcs({ t, minutes }) {
  return (
    <svg style={svgStyle}>
      <circle cx={50} cy={50} r={40} style={circleStyle} />

      {t > 0 && (
        <SoftArc
          start={0 + fudge}
          end={clampAbove(interpolate(0 + fudge, 120 - fudge, 0, 60, t), 120 - fudge)}
        />
      )}

      {t > 60 && (
        <SoftArc
          start={120 + fudge}
          end={clampAbove(interpolate(120 + fudge, 240 - fudge, 60, 120, t), 240 - fudge)}
        />
      )}

      {t > 120 && (
        <SoftArc
          start={240 + fudge}
          end={clampAbove(interpolate(240 + fudge, 360 - fudge, 120, 180, t), 360 - fudge)}
        />
      )}

      <text x={50} y={50} style={textStyle}>{minutes}</text>
    </svg>
  );
}
