/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import FontAwesome from "react-fontawesome";

class UploadFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { folderUploadText: "", active: false };
  }
  onClick(e) {
    this.setState({ active: true });
  }
  onChange(e) {
    this.props.filesListed(e.target.files);
    this.setState({ folderUploadText: e.target.files.length + " files" });
    this.setState({ active: false });
  }
  _addDirectory(node) {
    if (node) {
      node.directory = true;
      node.webkitdirectory = true;
    }
  }
  render() {
    return (
      <div>
        <div
          className="uploadLabel"
          style={{
            color: this.state.active
              ? "rgb(0, 188, 212)"
              : "rgba(0, 0, 0, 0.3)",
          }}
        >
          {this.props.label}
        </div>
        <div className="uploadFileField">
          <div className="uploadFileFieldIcon">
            <div style={{ display: "inline-flex" }}>
              <label htmlFor={"folderSelector"}>
                <FontAwesome
                  name="folder"
                  title="Click to select a Marxan project folder"
                  style={{ cursor: "pointer", display: "inline-flex" }}
                />
              </label>
            </div>
            <input
              id="folderSelector"
              ref={(node) => this._addDirectory(node)}
              type="file"
              onChange={this.onChange.bind(this)}
              onClick={this.onClick.bind(this)}
              style={{ display: "none", width: "10px" }}
            />
          </div>
          <div className="uploadFileFieldLabel">
            {this.state.folderUploadText}
          </div>
        </div>
      </div>
    );
  }
}

export default UploadFolder;
