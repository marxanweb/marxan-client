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
import MarxanTextField from "./MarxanTextField";
import Checkbox from "material-ui/Checkbox";

class ImportGBIFDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", gbifID: 0, suggestions: [], clicked: false };
  }
  onOk() {
    this.props
      .importGBIFData(this.state.selectedItem)
      .then((response) => {
        this.props.updateState({ importGBIFDialogOpen: false });
      })
      .catch((error) => {
        this.props.updateState({ importGBIFDialogOpen: false });
      });
  }
  changeSearchText(event, value) {
    if (this.state.searchText.length > 2 && !this.state.clicked) {
      //get the gbif suggested names
      this.props.gbifSpeciesSuggest(this.state.searchText).then((response) => {
        this.setState({ suggestions: response });
      });
    }
    this.setState({
      searchText: value,
      clicked: false,
      selectedItem: undefined,
    });
  }
  onClick(item, evt) {
    this.setState({ clicked: true }, () => {
      this.setState({ searchText: item.scientificName, selectedItem: item });
    });
  }
  render() {
    let suggestions = this.state.suggestions.map((item) => {
      return (
        <div
          key={item.key}
          className={"suggestion"}
          onClick={this.onClick.bind(this, item)}
        >
          {item.scientificName}
        </div>
      );
    });
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={390}
        offsetY={80}
        title="Import GBIF data"
        helpLink={
          "user.html#importing-from-the-global-biodiversity-information-facility-gbif"
        }
        onOk={this.onOk.bind(this)}
        okDisabled={this.state.selectedItem === undefined || this.props.loading}
        showCancelButton={true}
        autoDetectWindowHeight={false}
        children={
          <React.Fragment key={"importGBIFKey"}>
            <div className={"importGBIFContent"}>
              <MarxanTextField
                value={this.state.searchText}
                onChange={this.changeSearchText.bind(this)}
                floatingLabelText="Search"
                style={{ width: "330px" }}
              />
              <div
                className={"suggestions"}
                style={{
                  display:
                    this.state.searchText.length > 2 && !this.state.clicked
                      ? "block"
                      : "none",
                }}
              >
                {suggestions}
              </div>
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
        }
      />
    );
  }
}

export default ImportGBIFDialog;
