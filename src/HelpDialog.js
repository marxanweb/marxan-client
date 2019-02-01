import React from "react";
import MarxanDialog from "./MarxanDialog";

class HelpDialog extends React.Component {
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={358}
        offsetY={80}
        title="About"
        children={
          <div key="k20">
            Nothing to see here
          </div>
        }
      />
    );
  }
}

export default HelpDialog;
