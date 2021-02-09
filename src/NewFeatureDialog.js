/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import MarxanDialog from "./MarxanDialog";
import MarxanTextField from "./MarxanTextField";
import Checkbox from "material-ui/Checkbox";

class NewFeatureDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", description: "" };
  }
  changeName(event, newValue) {
    this.setState({ name: newValue });
  }
  changeDescription(event, newValue) {
    this.setState({ description: newValue });
  }
  createNewFeature() {
    this.props.createNewFeature(this.state.name, this.state.description);
  }
  render() {
    let c = (
      <React.Fragment key="k12">
        <div>
          <MarxanTextField
            value={this.state.name}
            onChange={this.changeName.bind(this)}
            floatingLabelText="Enter a name"
          />
          <MarxanTextField
            value={this.state.description}
            onChange={this.changeDescription.bind(this)}
            multiLine={true}
            rows={2}
            floatingLabelText="Enter a description"
          />
          <Checkbox
            label="Add to project"
            style={{
              fontSize: "12px",
              width: "200px",
              display: "inline-block",
              marginTop: "10px",
            }}
            onCheck={this.props.setAddToProject}
            checked={this.props.addToProject}
          />
        </div>
      </React.Fragment>
    );
    return (
      <MarxanDialog
        {...this.props}
        onOk={this.createNewFeature.bind(this)}
        okDisabled={
          !(
            this.state.name !== "" &&
            this.state.description !== "" &&
            this.props.loading === false
          )
        }
        showCancelButton={true}
        contentWidth={390}
        title="Create new feature"
        children={c}
        onRequestClose={this.props.onOk}
        helpLink={"user.html#drawing-features-on-screen"}
      />
    );
  }
}

export default NewFeatureDialog;
