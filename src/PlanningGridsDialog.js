import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
// import { faSync } from '@fortawesome/free-solid-svg-icons';
import Import from 'material-ui/svg-icons/action/get-app';
import Export from 'material-ui/svg-icons/editor/publish';
import ToolbarButton from './ToolbarButton';
import MarxanDialog from './MarxanDialog';
import MarxanTable from "./MarxanTable";

class PlanningGridsDialog extends React.Component { 
	constructor(props) {
		super(props);
		this.state = {searchText: "", selectedPlanningGrid: undefined};
	}
	_delete() {
		this.props.deletePlanningGrid(this.state.selectedPlanningGrid.feature_class_name);
		this.setState({ selectedPlanningGrid: false });
	}
	_new() {
		this.props.openNewPlanningGridDialog();
		this.closeDialog();
	}
	openImportDialog() {
		this.props.openImportPlanningGridDialog();
		this.closeDialog();
	}
	exportPlanningGrid(){
		this.props.exportPlanningGrid(this.state.selectedPlanningGrid.feature_class_name).then(url=>{
			window.location = url;
		});
		this.closeDialog();
	}
	changePlanningGrid(event, planningGrid) {
		this.setState({ selectedPlanningGrid: planningGrid });
	}
	closeDialog() {
		this.setState({ selectedPlanningGrid: undefined });
		this.props.onOk(); 
	}
	preview(planning_grid_metadata){
		this.props.previewPlanningGrid(planning_grid_metadata);
	}
    sortDate(a, b, desc) {
      return (new Date(a.slice(6, 8), a.slice(3, 5) - 1, a.slice(0, 2), a.slice(9, 11), a.slice(12, 14), a.slice(15, 17)) > new Date(b.slice(6, 8), b.slice(3, 5) - 1, b.slice(0, 2), b.slice(9, 11), b.slice(12, 14), b.slice(15, 17))) ? 1 : -1;
    }
	renderName(row){
		return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.alias + " (" + row.original.feature_class_name + ")"}>{row.original.alias}</div>;        
	}
	renderTitle(row){
		return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.description}>{row.original.description}</div>;        
	}
    renderDate(row) {
      return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.creation_date}>{row.original.creation_date.substr(0,8)}</div>;
    }
    renderCreatedBy(row) {
      return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.created_by}>{row.original.created_by}</div>;
    }
	renderCountry(row){
		return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.country}>{row.original.country}</div>;        
	}
	renderArea(row){
		return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}}>{(isNaN(row.original._area)) ? '' : row.original._area}</div>;        
	}
	renderPreview(row){
		return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title='Click to preview'>..</div>;        
	}
    searchTextChanged(value){
      this.setState({searchText: value});
    }
	render() {
		let tableColumns = [];
		tableColumns = [
			{ Header: 'Name', accessor: 'alias', width: 290, headerStyle: { 'textAlign': 'left' }, Cell: this.renderName.bind(this) }, 
			{ Header: 'Description', accessor: 'description', width: 269, headerStyle: { 'textAlign': 'left' }, Cell: this.renderTitle.bind(this) }, 
			// { Header: 'Country', accessor: 'country', width: 70, headerStyle: { 'textAlign': 'left' }, Cell: this.renderCountry.bind(this)}, 
			// { Header: 'Domain', accessor: 'domain', width: 70, headerStyle: { 'textAlign': 'left' }}, 
			// { Header: 'Area (Km2)', accessor: '_area', width: 73, headerStyle: { 'textAlign': 'left' }, Cell: this.renderArea.bind(this) },
            { Header: 'Created', accessor: 'creation_date', width: 70, headerStyle: {'textAlign': 'left'}, Cell: this.renderDate.bind(this), sortMethod: this.sortDate.bind(this)},
            { Header: 'Created by', accessor: 'created_by', width: 70, headerStyle: {'textAlign': 'left'}, Cell: this.renderCreatedBy.bind(this)},
			{ Header: '', width: 8, headerStyle: { 'textAlign': 'center' }, Cell: this.renderPreview.bind(this) }
		];
		return (
			<MarxanDialog 
				{...this.props} 
				// titleBarIcon={faBookOpen}
				onOk={this.closeDialog.bind(this)}
				showCancelButton={false}
				helpLink={"user.html#the-planning-grids-window"}
				autoDetectWindowHeight={false}
				bodyStyle={{ padding:'0px 24px 0px 24px'}}
				title="Planning grids"  
				showSearchBox={true} 
				searchTextChanged={this.searchTextChanged.bind(this)}
				children={
					<React.Fragment key="k2">
							<div id="projectsTable">
								<MarxanTable 
									data={this.props.planningGrids}
									columns={tableColumns}
		                            searchColumns={['country','domain','alias','description','created_by']}
		                            searchText={this.state.searchText}
		                            selectedPlanningGrid={this.state.selectedPlanningGrid}
		                            changePlanningGrid={this.changePlanningGrid.bind(this)}
									getTrProps={(state, rowInfo) => {
										return {
											style: {
												background: (rowInfo.original.alias === (state.selectedPlanningGrid && state.selectedPlanningGrid.alias)) ? "aliceblue" : ""
											},
											onClick: (e) => {
												state.changePlanningGrid(e, rowInfo.original);
											}
										};
									}}
									getTdProps={(state, rowInfo,column) => {
										return {
											onClick: (e) => {
												if (column.Header === "") this.preview(rowInfo.original);
											}
										};
									}}
								/>
							</div>
							<div id="projectsToolbar" style={{display: (this.props.userRole === "ReadOnly") ? 'none' : 'block'}}>
							<ToolbarButton 
								show={!this.props.unauthorisedMethods.includes("createPlanningUnitGrid")} 
								icon={<FontAwesomeIcon icon={faPlusCircle} />} 
								title="New planning grid"
								onClick={this._new.bind(this)} 
								label={"New"}
							/>
							<ToolbarButton 
								show={!this.props.unauthorisedMethods.includes("importPlanningUnitGrid")}
								icon={<Import style={{height:'20px',width:'20px'}}/>} 
								title="Import an existing planning grid from the local machine"
								onClick={this.openImportDialog.bind(this)} 
								label={"Import"}
							/>
							<ToolbarButton 
								show={!this.props.unauthorisedMethods.includes("exportPlanningUnitGrid")}
								icon={<Export style={{height:'20px',width:'20px'}}/>} 
								title="Export planning grid" 
								onClick={this.exportPlanningGrid.bind(this)} 
								disabled={!this.state.selectedPlanningGrid || this.props.loading}
								label={"Export"}
							/> 
							<ToolbarButton  
								show={!this.props.unauthorisedMethods.includes("deletePlanningUnitGrid")}
								icon={<FontAwesomeIcon icon={faTrashAlt}  color='rgb(255, 64, 129)'/>} 
								title="Delete planning grid" 
								disabled={!this.state.selectedPlanningGrid || this.props.loading || (this.state.selectedPlanningGrid && this.state.selectedPlanningGrid.created_by === 'global admin')}
								onClick={this._delete.bind(this)} 
								label={"Delete"}
							/>
							{/*<ToolbarButton  
								show={(this.props.marxanServer.system !== "Windows")}
								icon={<FontAwesomeIcon icon={faSync} color='rgb(51, 153, 51)'/>} 
								title="Refresh planning grids" 
								disabled={this.props.loading}
								onClick={this.props.getPlanningUnitGrids} 
								label={"Refresh"}
							/>*/}
						</div>
					</React.Fragment>
				} 
			/>
		); //return
	}
}

export default PlanningGridsDialog;
