import React from "react";
import MarxanDialog from "./MarxanDialog";
import mapbox_small from './mapbox_small.png';
import biopama_small from './biopama_small.png';
import jrc_logo_color_small from './jrc_logo_color_small.png';

class AboutDialog extends React.Component {
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={376}
        offsetY={80}
        title="About"
        children={
          <div key="k5">
            <div className={"aboutText"}>
              Marxan Web v1.5 Feedback:{" "}
              <a href="mailto:andrew.cottam@ec.europa.eu" className="email">
                Andrew Cottam
              </a>
            </div>
            <div className={"aboutText"}>
              Marxan 2.4.3 - Ian Ball, Matthew Watts &amp; Hugh Possingham
            </div>
            <div className={"aboutText"} style={{marginTop:'10px'}}>
              Funded by the BIOPAMA project of the European Commission
            </div>
            <div className={"logos"}>
            <a href="https://www.biopama.org">
	            <img
	              src={biopama_small}
	              alt="BIOPAMA logo"
	              title={"BIOPAMA logo"}
	              className={"aboutLogo"}
	            />
	            </a>
	            <img
	              src={jrc_logo_color_small}
	              alt="Joint Research Centre of the European Commission logo"
	              title={"Joint Research Centre of the European Commission logo"}
	              className={"aboutLogo"}
	            />
            </div>
            <div className={"aboutText"} style={{marginTop:'10px'}}>
              With in-kind contributions from Mapbox
            </div>
            <a href="https://www.mapbox.com">
	            <img
	              src={mapbox_small}
	              alt="Mapbox logo"
	              title={"Mapbox logo"}
	              className={"aboutLogo"}
	            />
            </a>
          </div>
        }
      />
    );
  }
}

export default AboutDialog;
