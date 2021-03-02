/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
/*eslint-disable no-unused-vars*/
import axios, { post } from "axios";
/*eslint-enable no-unused-vars*/
import FontAwesome from "react-fontawesome";
import Sync from "material-ui/svg-icons/notification/sync";

//From AshikNesin https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      active: false,
    };
    this.onChange = this.onChange.bind(this);
    //the destination folder on the server where the file will be uploaded
    this.destFolder = props.hasOwnProperty("destFolder")
      ? props.destFolder
      : "";
  }

	onClick(e){
		this.setState({active:true});
	}
	onChange(e) {
		if (e.target.files.length) {
			//set the loading state 
			this.setState({ loading: true });
			//get the filename - if a unique filename is needed then append the user in front
			this.filename = (this.props.hasOwnProperty('uniqueName')) ? this.props.user + e.target.files[0].name : e.target.files[0].name;
			//upload the file
			this.props.fileUpload(e.target.files[0], this.filename, this.destFolder).then(response=>{
				this.setState({ loading: false,active:false});
				this.props.setFilename(this.filename);
			});
			//reset the file selector
			document.getElementById(this.id).value = "";
		}
	}

  render() {
    this.id = "upload" + this.props.parameter;
    return (
      <form style={this.props.style}>
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
            <label htmlFor={this.id}>
              <FontAwesome
                name="file"
                title="Click to upload a file"
                style={{ cursor: "pointer" }}
              />
            </label>
            <input
              type="file"
              onChange={this.onChange}
              onClick={this.onClick.bind(this)}
              accept={this.props.fileMatch}
              style={{ display: "none", width: "10px" }}
              id={this.id}
            />
          </div>
          <div className="uploadFileFieldLabel" style={{ width: "168px" }}>
            {this.props.filename}
          </div>
        </div>
        <Sync
          className="spin"
          style={{
            display: this.state.loading ? "inline-block" : "none",
            marginLeft: "6px",
            color: "rgb(255, 64, 129)",
            height: "22px",
            width: "22px",
            verticalAlign: "middle",
          }}
          key={"spinner"}
        />
      </form>
    );
  }
}

export default FileUpload;
