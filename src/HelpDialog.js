import React from "react";
import MarxanDialog from "./MarxanDialog";

class HelpDialog extends React.Component {
	render() {
		return (
			<MarxanDialog
				{...this.props}
				contentWidth={358}
				offsetY={80}
				title="Help"
				children={
					<div key="k20" className="serverDetails">
						Documentation is available here: <a href='https://github.com/andrewcottam/marxan-client/wiki/Documentation' target='_blank'  rel="noopener noreferrer">https://github.com/andrewcottam/marxan-client/wiki/Documentation</a>
					</div>
				}
			/>
		);
	}
}

export default HelpDialog;
