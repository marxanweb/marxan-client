import React from "react";
import MarxanDialog from "./MarxanDialog";
import iucn from './iucn.png';
import wcmc from './wcmc.png';
import mapbox_small from './mapbox_small.png';
import biopama_small from './biopama_small.png';
import jrc_logo_color_small from './jrc_logo_color_small.png';

class AboutDialog extends React.Component {
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={500}
        offsetY={80}
        title="About"
        children={
          <div key="k5">
            <div className={"aboutTitle"}>Software development</div>
            <div className={"aboutText"}>
              Marxan Web v{this.props.marxanClientReleaseVersion} Feedback:{" "}
              <a href="mailto:andrew.cottam@ec.europa.eu" className="email">
                Andrew Cottam
              </a>
            </div>
            <div className={"aboutText"}>
              Marxan 2.4.3 - Ian Ball, Matthew Watts &amp; Hugh Possingham
            </div>
            <div className={"aboutTitle"}>Data providers</div>
            <div className={"aboutText"} style={{marginTop:'10px'}}>
              Uses data from the World Database of Protected Areas. IUCN and UNEP-WCMC (2017), The World Database on Protected Areas (WDPA) August 2017, Cambridge, UK: UNEP-WCMC. Available at: <a href='http://www.protectedplanet.net'>www.protectedplanet.net</a>
            </div>
            <div className={"aboutTitle"}>Funding and in-kind contributions</div>
            <div className={"aboutText"} style={{marginTop:'10px'}}>
              Marxan Web funded by the BIOPAMA project of the European Commission. With in-kind contributions from Mapbox. 
            </div>
            <div className={"aboutText"} style={{marginTop:'10px'}}>
              Marxan funded by a range of donors - see <a href='http://marxan.org/credits.html' target='_blank' rel="noopener noreferrer">here</a>.
            </div>
           <div className={"logos"}>
            <a href="https://www.iucn.org/">
	            <img
	              src={iucn}
	              alt="IUCN logo"
	              title={"IUCN logo"}
	              className={"aboutLogo"}
	            />
            </a>
            <a href="https://www.unep-wcmc.org/">
	            <img
	              src={wcmc}
	              alt="UN Environment WCMC logo"
	              title={"UN Environment WCMC logo"}
	              className={"aboutLogo"}
	            />
            </a>
            <a href="https://www.biopama.org">
	            <img
	              src={biopama_small}
	              alt="BIOPAMA logo"
	              title={"BIOPAMA logo"}
	              className={"aboutLogo"}
	            />
	            </a>
	            <a href="https://ec.europa.eu/jrc/en">
	            <img
	              src={jrc_logo_color_small}
	              alt="Joint Research Centre of the European Commission logo"
	              title={"Joint Research Centre of the European Commission logo"}
	              className={"aboutLogo"}
	            />
	            </a>
              <a href="https://www.mapbox.com">
  	            <img
  	              src={mapbox_small}
  	              alt="Mapbox logo"
  	              title={"Mapbox logo"}
  	              className={"aboutLogo"}
  	            />
              </a>
            </div>
          </div>
        }
      />
    );
  }
}

export default AboutDialog;
