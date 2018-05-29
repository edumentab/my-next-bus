import React, { Component } from 'react';
import { parseString } from 'xml2js';

const SKANETRAFIKEN_URL = "http://www.labs.skanetrafiken.se/v2.2/stationresults.asp?selPointFrKey=80002";
const ONE_SECOND = 1000;
const FRAMES_PER_SECOND = 60;

function extractLinesFromXml(result) {
  return result["soap:Envelope"]["soap:Body"][0].GetDepartureArrivalResponse[0].GetDepartureArrivalResult[0].Lines[0].Line;
}

function extractDeparturesForLine(lines, wantedLine) {
  return lines.filter((line) => line.No[0] === wantedLine).map((line) => line.JourneyDateTime[0]);
}

const circleStyle = {
  fill: "none",
  stroke: "#eee",
  strokeWidth: 6,
};

const filledCircleStyle = {
  ...circleStyle,
  fill: "#eee",
};

const arcStyle = {
  fill: "none",
  stroke: "#0d0",
  strokeWidth: 6,
  strokeLinecap: "round",
};

const textStyle = {
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: "48px",
  // fontWeight: "bold",
};

function pointOnCircle(cx, cy, r, angleInDegrees) {
  let angleInRadians = angleInDegrees / 180 * Math.PI;
  let x = cx + r * Math.sin(angleInRadians);
  let y = cy - r * Math.cos(angleInRadians);
  return `${x},${y}`;
}

let SoftArc = (props) => {
  let startPoint = pointOnCircle(50, 50, 40, props.start);
  let endPoint = pointOnCircle(50, 50, 40, props.end);
  return (
    <svg>
      <path d={
        `M ${startPoint} A 40,40 0 0,1 ${endPoint}`
      } style={arcStyle} />
    </svg>
  );
};

function interpolate(lowA, highA, lowB, highB, b) {
  return (b - lowB) / (highB - lowB) * (highA - lowA) + lowA;
}

function clampAbove(value, upperLimit) {
  return Math.min(value, upperLimit);
}

function clampBelow(value, lowerLimit) {
  return Math.max(value, lowerLimit);
}

const fudge = 5;

let RemainingTimeArcs = ({ t, minutes }) => (
  <svg>
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

let MinuteCount = ({ minutes }) => (
  <svg>
    <circle cx={50} cy={50} r={40} style={filledCircleStyle} />

    <text x={50} y={50} style={textStyle}>{minutes}</text>
  </svg>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departures: [],
      currentTime: new Date(),
    };

    this.remainingSeconds = this.remainingSeconds.bind(this);
  }

  componentDidMount() {
    let request = new Request(SKANETRAFIKEN_URL);

    fetch(request).then((response) => {
      return response.blob();
    }).then((blob) => {
      let reader = new FileReader();
      reader.addEventListener("loadend", () => {
        parseString(reader.result, (err, result) => {
          let lines = extractLinesFromXml(result);
          let lineNumbers = new Set(lines.map(line => line.No[0]));
          let departures = {};
          for (let lineNumber of lineNumbers) {
            departures[lineNumber] = extractDeparturesForLine(lines, lineNumber);
          }
          this.setState({ departures });
        });
      });
      reader.readAsText(blob, "UTF-8");
    });

    this.intervalHandle = setInterval(
      () => (this.setState({ currentTime: new Date() })),
      ONE_SECOND / FRAMES_PER_SECOND
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
  }

  remainingSeconds(departure) {
    return Math.floor((new Date(departure) - this.state.currentTime) / 1000);
  }

  render() {
    // exit early if we have no data
    if (this.state.departures.length === 0) {
      return null;
    }

    return Object.keys(this.state.departures).map((lineNumber) => {
      let secondsToNextBus = this.state.departures[lineNumber].map(this.remainingSeconds).find(s => (s >= -60));
      let minutes = clampBelow(Math.floor(secondsToNextBus / 60 + 1), 0);
      let showArcs = minutes > 0 && minutes <= 3;

      return (
        <div key={lineNumber}>
          <h2>Line {lineNumber}</h2>
          {
            showArcs
              ? <RemainingTimeArcs t={secondsToNextBus} minutes={minutes} />
              : <MinuteCount minutes={minutes} />
          }
        </div>
      );
    });
  }
}

export default App;
