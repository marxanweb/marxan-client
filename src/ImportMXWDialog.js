/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import MarxanDialog from "./MarxanDialog";
import ToolbarButton from "./ToolbarButton";
import Metadata from "./Metadata";
import FileUpload from "./FileUpload";

//some of the code in this component should be moved up to app.js like the POSTs but I have limited time

class ImportMXWDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: ["mxw file", "Info"],
      loading: false,
      stepIndex: 0,
      name: "",
      description: "",
      zipFilename: "",
    };
  }
  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 1) {
      this.setState({ loading: true });
      //create the new project
      this.props
        .importMXWProject(
          this.state.name,
          this.state.description,
          this.state.zipFilename
        )
        .then((response) => {
          this.onOk();
        })
        .catch((error) => {
          this.setState({ loading: false });
          this.props.log(error + "Import stopped");
          this.props.setSnackBar(error);
        });
      return;
    }
    this.setState({ stepIndex: stepIndex + 1 });
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };
  setZipFilename(filename) {
    this.setState({ zipFilename: filename });
  }
  setName(value) {
    this.setState({ name: value });
  }
  setDescription(value) {
    this.setState({ description: value });
  }
  onOk() {
    //return the wizard back to zero
    this.setState({ loading: false, stepIndex: 0, zipFilename: "" });
    this.props.onOk();
  }
  render() {
    const { stepIndex } = this.state;
    const contentStyle = { margin: "0 16px" };
    const actions = [
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <div style={contentStyle}>
          <div style={{ marginTop: 12 }}>
            <ToolbarButton
              label="Back"
              disabled={stepIndex === 0}
              onClick={this.handlePrev}
            />
            <ToolbarButton
              label={
                stepIndex === this.state.steps.length - 1 ? "Finish" : "Next"
              }
              onClick={this.handleNext.bind(this)}
              primary={true}
              disabled={
                this.state.loading ||
                this.state.zipFilename === "" ||
                (stepIndex === 1 &&
                  (this.state.name === "" || this.state.description === ""))
              }
            />
          </div>
        </div>
      </div>,
    ];
    let c = (
      <React.Fragment key="k4">
        <div>
          {stepIndex === 0 ? (
            <div>
              <FileUpload
                {...this.props}
                fileMatch={".mxw"}
                destFolder="imports"
                mandatory={true}
                filename={this.state.zipFilename}
                setFilename={this.setZipFilename.bind(this)}
                label="Select *.mxw file"
                style={{ paddingTop: "20px" }}
              />
            </div>
          ) : null}
          {stepIndex === 1 ? (
            <Metadata
              name={this.state.name}
              description={this.state.description}
              setName={this.setName.bind(this)}
              setDescription={this.setDescription.bind(this)}
            />
          ) : null}
        </div>
      </React.Fragment>
    );
    return (
      <MarxanDialog
        {...this.props}
        title={"Import Marxan Web project"}
        contentWidth={390}
        children={c}
        okLabel={"Cancel"}
        actions={actions}
        onOk={this.onOk.bind(this)}
        onRequestClose={this.onOk.bind(this)}
        helpLink={"user.html#importing-marxan-web-projects"}
      />
    );
  }
}

export default ImportMXWDialog;
