import React from 'react';

import { alertStyle, alertIconStyle } from '../styles';

export default function FetchErrorAlert(props) {
  return (
    <div className="col-sm alert alert-warning" role="alert" style={alertStyle}>
      <div style={alertIconStyle}>
        ⚠
      </div>

      <div>
        <p><strong>The request failed!</strong> It's a cross-origin request to Skånetrafiken, and this browser does not
          want to send such a request.</p>

        <p>Usually there are good security reasons to have cross-origin requests switched off in the browser, but for
          this hackathon it's exactly what we want switched on.</p>

        <p>If you're on Chrome, you can add&nbsp;
          <a href="https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi">this plugin</a>
          &nbsp;which will install a small "CORS" icon in the browser toolbar, where you can switch on cross-origin requests.</p>

        <p>Don't do this at home! But this is someone else's computer, so it's fine.</p>
      </div>
    </div>
  );
}