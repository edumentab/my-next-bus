import React, { Component } from 'react';
import { parseString } from 'xml2js';

const SKANETRAFIKEN_URL = "http://www.labs.skanetrafiken.se/v2.2/stationresults.asp?selPointFrKey=80002";

function extractLinesFromXml(result) {
  return result["soap:Envelope"]["soap:Body"][0].GetDepartureArrivalResponse[0].GetDepartureArrivalResult[0].Lines[0].Line;
}

function extractDeparturesForLine(lines, wantedLine) {
  return lines.filter((line) => line.No[0] === wantedLine).map((line) => line.JourneyDateTime[0]);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departures: [],
    };
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
          this.setState({
            departures: extractDeparturesForLine(lines, "3"),
          });
        });
      });
      reader.readAsText(blob, "UTF-8");
    });
  }

  render() {
    return (
      <ul>
        {this.state.departures.map((departure) => <li key={departure}>{departure}</li>)}
      </ul>
    );
  }
}

export default App;
