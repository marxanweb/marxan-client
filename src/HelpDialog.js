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
						Documentation is available here: <a href='https://andrewcottam.github.io/marxan-web/docs_overview.html' target='_blank'  rel="noopener noreferrer">https://andrewcottam.github.io/marxan-web/docs_overview.html</a>
					</div>
				}
			/>
		);
	}
}

export default HelpDialog;
