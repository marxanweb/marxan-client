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
import UploadMarxanFiles from "./UploadMarxanFiles";

//some of the code in this component should be moved up to app.js like the POSTs but I have limited time

class ImportProjectDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: ["Files and planning grid", "Info"],
      loading: false,
      stepIndex: 0,
      name: "",
      description: "",
      zipFilename: "",
      files: [],
      planning_grid_name: "",
    };
  }
  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 1) {
      this.setState({ loading: true });
      //create the new project
      this.props
        .importProject(
          this.state.name,
          this.state.description,
          this.state.zipFilename,
          this.state.files,
          this.state.planning_grid_name
        )
        .then((response) => {
          //close the import wizard
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
  filesListed(files) {
    //TODO filter the files to exclude all of the output files - these are unnecessary and will be creating on the first run anyway
    this.setState({ files: files });
  }
  setZipFilename(filename) {
    this.setState({ zipFilename: filename });
  }
  setPlanningGridName(event, planning_grid_name) {
    this.setState({ planning_grid_name: planning_grid_name });
  }
  setName(value) {
    this.setState({ name: value });
  }
  setDescription(value) {
    this.setState({ description: value });
  }
  onOk() {
    //return the wizard back to zero
    this.setState({ loading: false, stepIndex: 0 });
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
                (stepIndex === 0 &&
                  (this.state.files.length === 0 ||
                    this.state.zipFilename === "" ||
                    this.state.planning_grid_name === "")) ||
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
            <UploadMarxanFiles
              {...this.props}
              filesListed={this.filesListed.bind(this)}
              setZipFilename={this.setZipFilename.bind(this)}
              setPlanningGridName={this.setPlanningGridName.bind(this)}
              planning_grid_name={this.state.planning_grid_name}
            />
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
        title={"Import Marxan DOS project"}
        contentWidth={390}
        children={c}
        okLabel={"Cancel"}
        actions={actions}
        onOk={this.onOk.bind(this)}
        onRequestClose={this.onOk.bind(this)}
        helpLink={"user.html#importing-marxan-dos-projects"}
      />
    );
  }
}

export default ImportProjectDialog;
