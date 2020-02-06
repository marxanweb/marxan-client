import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import Import from 'material-ui/svg-icons/action/get-app';
import ToolbarButton from './ToolbarButton';
import MarxanDialog from './MarxanDialog';
import MarxanTable from "./MarxanTable";
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
//import gbif_logo from './gbif.jpg';
//import FontIcon from 'material-ui/FontIcon';
// add this to the gbif item: leftIcon={<FontIcon className="gbifLogo"/> 

class FeaturesDialog extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        selectedFeature: undefined,
        previousRow: undefined,
        searchText: "",
      };
    }
    _delete() {
      this.props.deleteFeature(this.state.selectedFeature);
      this.setState({ selectedFeature: undefined });
    }
    showNewFeaturePopover(event) {
      this.setState({ newFeatureAnchor: event.currentTarget });
      this.props.showNewFeaturePopover();
    }
    showImportFeaturePopover(event) {
      this.setState({ importFeatureAnchor: event.currentTarget });
      this.props.showImportFeaturePopover();
    }
    _openImportFeaturesDialog() {
      //close the dialog
      this.props.onCancel();
      //show the new feature dialog
      this.props.openImportFeaturesDialog("import");
    }
    _newByDigitising() {
      //hide this dialog
      this.onOk();
      //show the drawing controls
      this.props.initialiseDigitising();
    }
    openImportGBIFDialog() {
      this.props.openImportGBIFDialog();
      this.props.onCancel();
    }
    clickFeature(event, rowInfo) {
      //if adding or removing features from a project
      if (this.props.addingRemovingFeatures) {
        //if the shift key is pressed then select/deselect the features in between
        if (event.shiftKey) {
          //get the selected feature ids
          let selectedIds = this.getFeaturesBetweenRows(this.state.previousRow, rowInfo);
          //update the selected ids
          this.props.selectFeatures(selectedIds);
        }
        else { //single feature has been clicked
          this.props.clickFeature(rowInfo.original, event.shiftKey, this.state.previousRow);
        }
        this.setState({ previousRow: rowInfo });
      }
      else {
        this.setState({ selectedFeature: rowInfo.original });
      }
    }

    //gets the features ids between the two passed rows and toggles their selection state
    getFeaturesBetweenRows(previousRow, thisRow) {
      let selectedIds = this.props.selectedFeatureIds;
      let idx1 = (previousRow.index < thisRow.index) ? previousRow.index + 1 : thisRow.index;
      let idx2 = (previousRow.index < thisRow.index) ? thisRow.index + 1 : previousRow.index;
      //get the features between the two indices
      let spannedFeatures = this.props.allFeatures.slice(idx1, idx2);
      //iterate through the spanned features and toggle their selected state
      spannedFeatures.forEach((feature) => {
        if (selectedIds.includes(feature.id)) {
          selectedIds.splice(selectedIds.indexOf(feature.id), 1);
        }
        else {
          selectedIds.push(feature.id);
        }
      });
      return selectedIds;
    }
    onOk(evt) {
      if (this.props.addingRemovingFeatures) {
        this.props.onOk();
      }
      else {
        this.unselectFeature();
      }
    }
    unselectFeature(evt) {
      this.setState({
        selectedFeature: undefined
      });
      this.props.onCancel();
    }
    sortDate(a, b, desc) {
      return (new Date(a.slice(6, 8), a.slice(3, 5) - 1, a.slice(0, 2), a.slice(9, 11), a.slice(12, 14), a.slice(15, 17)) > new Date(b.slice(6, 8), b.slice(3, 5) - 1, b.slice(0, 2), b.slice(9, 11), b.slice(12, 14), b.slice(15, 17))) ? 1 : -1;
    }
    preview(feature_metadata) {
      this.props.previewFeature(feature_metadata);
    }
    renderTitle(row) {
      return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.description}>{row.original.description}</div>;
    }
    renderPreview(row) {
      return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title='Click to preview'>..</div>;
    }
    searchTextChanged(value){
      this.setState({searchText: value});
    }
    render() {
        if (this.props.allFeatures) {
          return (
              <MarxanDialog {...this.props} autoDetectWindowHeight={ false } bodyStyle={ { padding: '0px 24px 0px 24px' } } title="Features" onOk={ this.onOk.bind(this) } showCancelButton={this.props.addingRemovingFeatures} helpLink={"docs_user.html#the-features-window"} showSearchBox={true} searchTextChanged={this.searchTextChanged.bind(this)}
          children={ <React.Fragment key="k10">
                        <div id="projectsTable">
                          <MarxanTable 
                            data={this.props.allFeatures} 
                            searchColumns={['alias','description']}
                            searchText={this.state.searchText}
                            addingRemovingFeatures={this.props.addingRemovingFeatures}
                            selectedFeatureIds={this.props.selectedFeatureIds}
                            selectedFeature={this.state.selectedFeature}
                            clickFeature={this.clickFeature.bind(this)}
                            preview={this.preview.bind(this)}
                            columns={[{Header: 'Name', accessor: 'alias', width: 215, headerStyle: {'textAlign': 'left'}},  {Header: 'Description', accessor: 'description', width: 355, headerStyle: {'textAlign': 'left'}, Cell: this.renderTitle.bind(this)}, {Header: 'Date', accessor: 'creation_date', width: 115, headerStyle: {'textAlign': 'left'}, sortMethod: this.sortDate.bind(this)},{Header: '', width: 8, headerStyle: {'textAlign': 'center'}, Cell: this.renderPreview.bind(this)}]}
                            getTrProps={(state, rowInfo, column) => {
                              return {
                                style: {background: ((state.addingRemovingFeatures && state.selectedFeatureIds.includes(rowInfo.original.id)) || (!state.addingRemovingFeatures && state.selectedFeature && state.selectedFeature.id === rowInfo.original.id)) ? "aliceblue" : ""},
                                onClick: (e) => {
                                  state.clickFeature(e, rowInfo);
                                }
                              };
                            }}
                            getTdProps={(state, rowInfo,column) => {
                              return {
                                onClick: (e) => {
                                  if (column.Header === "") state.preview(rowInfo.original);
                                }
                              };
                            }}
                          />
                       </div>
                       <div id="projectsToolbar">
                         <div style={ { display: (this.props.metadata.OLDVERSION) ? "block" : "none" } } className={ 'tabTitle' }>This is an imported project. Only features from this project are shown.</div>
                         <ToolbarButton show={ (this.props.userRole !== "ReadOnly") && (!this.props.metadata.OLDVERSION) && (!this.props.addingRemovingFeatures) } icon={ <FontAwesomeIcon icon={ faPlusCircle } /> } title="New feature" disabled={ this.props.loading } onClick={ this.showNewFeaturePopover.bind(this) } label={ "New" }/>
                         <Popover open={ this.props.newFeaturePopoverOpen} anchorEl={ this.state.newFeatureAnchor } anchorOrigin={ { horizontal: 'left', vertical: 'bottom' } } targetOrigin={ { horizontal: 'left', vertical: 'top' } } onRequestClose={ this.props.hideNewFeaturePopover }>
                           <Menu desktop={ true }>
                             <MenuItem primaryText="Draw on screen" title="Create a new feature by digitising it on the screen" onClick={ this._newByDigitising.bind(this) } />
                           </Menu>
                         </Popover>
                         <ToolbarButton show={ (!this.props.metadata.OLDVERSION) && (!this.props.addingRemovingFeatures) && (this.props.userRole !== "ReadOnly") } icon={<Import style={{height:'20px',width:'20px'}}/>} title="Create new features from existing data" disabled={ this.props.loading }  onClick={ this.showImportFeaturePopover.bind(this) } label={ "Import" }/>
                         <Popover open={ this.props.importFeaturePopoverOpen } anchorEl={ this.state.importFeatureAnchor } anchorOrigin={ { horizontal: 'left', vertical: 'bottom' } } targetOrigin={ { horizontal: 'left', vertical: 'top' } } onRequestClose={ this.props.hideImportFeaturePopover }>
                           <Menu desktop={ true }>
                             <MenuItem primaryText="From a shapefile" title="Import one or more features from a shapefile" onClick={this._openImportFeaturesDialog.bind(this)} />
                             <MenuItem primaryText="From the Global Biodiversity Information Facility" title="The worlds largest provider of species observations" onClick={ this.openImportGBIFDialog.bind(this) } />
                             <MenuItem primaryText="From the IUCN Red List of Threatened Species" disabled={ true } />
                           </Menu>
                         </Popover>
                         <ToolbarButton show={ (this.props.userRole === "Admin") && (!this.props.metadata.OLDVERSION) && (!this.props.addingRemovingFeatures) } icon={ <FontAwesomeIcon icon={ faTrashAlt } color='rgb(255, 64, 129)' /> } title="Delete feature" disabled={ this.state.selectedFeature === undefined || this.props.loading  || (this.state.selectedFeature && this.state.selectedFeature.created_by === 'global admin')} onClick={ this._delete.bind(this) } label={ "Delete" }/>
                         <ToolbarButton show={ this.props.addingRemovingFeatures } icon={ <FontAwesomeIcon icon={ faCircle } /> } title="Clear all features" onClick={ this.props.clearAllFeatures } label={ "Clear all" } />
                         <ToolbarButton show={ this.props.addingRemovingFeatures } icon={ <FontAwesomeIcon icon={ faCheckCircle } /> } title="Select all features" onClick={ this.props.selectAllFeatures } label={ "Select all" } />
                       </div>
                     </React.Fragment> } />
        );
    } else {
      return null;
    }
  }
}

export default FeaturesDialog;
