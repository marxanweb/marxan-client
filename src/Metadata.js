/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import MarxanTextField from "./MarxanTextField";

class Metadata extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validName: undefined,
    };
  }
  changeName(event, newValue) {
    this.props.setName(newValue);
  }
  changeDescription(event, newValue) {
    this.props.setDescription(newValue);
  }
  render() {
    return (
      <React.Fragment>
        <div style={{ marginTop: "-13px" }}>
          <MarxanTextField
            style={{ width: "310px" }}
            errorText={this.state.validName === false ? "Required field" : ""}
            value={this.props.name}
            onChange={this.changeName.bind(this)}
            floatingLabelText="Enter a name for the project"
          />
          <MarxanTextField
            style={{ width: "310px" }}
            value={this.props.description}
            onChange={this.changeDescription.bind(this)}
            multiLine={true}
            rows={3}
            floatingLabelText="Enter a description for the project"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Metadata;
