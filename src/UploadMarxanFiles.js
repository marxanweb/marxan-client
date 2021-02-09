/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import UploadFolder from "./UploadFolder";
import FileUpload from "./FileUpload";
import MarxanTextField from "./MarxanTextField";

class UploadMarxanFiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = { planning_grid_name: "", zipFilename: "" };
  }
  setzipFilename(filename) {
    this.setState({ zipFilename: filename });
    this.props.setZipFilename(filename);
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <UploadFolder
            label="Marxan project folder"
            filesListed={this.props.filesListed}
          />
          <FileUpload
            {...this.props}
            fileMatch={".zip"}
            destFolder="imports"
            mandatory={true}
            filename={this.state.zipFilename}
            setFilename={this.setzipFilename.bind(this)}
            label="Planning grid zipped shapefile"
            style={{ paddingTop: "15px" }}
          />
          <MarxanTextField
            style={{ width: "310px" }}
            value={this.props.planning_grid_name}
            onChange={this.props.setPlanningGridName}
            floatingLabelText="Planning grid name"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default UploadMarxanFiles;
