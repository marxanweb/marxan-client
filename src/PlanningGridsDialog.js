import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import Import from 'material-ui/svg-icons/action/get-app';
import ToolbarButton from './ToolbarButton';
import MarxanDialog from './MarxanDialog';
import ReactTable from "react-table";

class PlanningGridsDialog extends React.Component { 
	constructor(props) {
		super(props);
		this.state = {selectedPlanningGrid: undefined};
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
	renderName(row){
		return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.alias + " (" + row.original.feature_class_name + ")"}>{row.original.alias}</div>;        
	}
	renderTitle(row){
		return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.description}>{row.original.description}</div>;        
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
	render() {
		let tableColumns = [];
		tableColumns = [
			{ Header: 'Name', accessor: 'alias', width: 215, headerStyle: { 'textAlign': 'left' }, Cell: this.renderName.bind(this) }, 
			{ Header: 'Description', accessor: 'description', width: 273, headerStyle: { 'textAlign': 'left' }, Cell: this.renderTitle.bind(this) }, 
			{ Header: 'Country', accessor: 'country', width: 70, headerStyle: { 'textAlign': 'left' }, Cell: this.renderCountry.bind(this)}, 
			{ Header: 'Domain', accessor: 'domain', width: 70, headerStyle: { 'textAlign': 'left' }}, 
			{ Header: 'Area (Km2)', accessor: '_area', width: 75, headerStyle: { 'textAlign': 'left' }, Cell: this.renderArea.bind(this) },
			{ Header: '', width: 8, headerStyle: { 'textAlign': 'center' }, Cell: this.renderPreview.bind(this) }
		];
		return (
			<MarxanDialog 
				{...this.props} 
				// titleBarIcon={faBookOpen}
				onOk={this.closeDialog.bind(this)}
				showCancelButton={true}
				autoDetectWindowHeight={false}
				bodyStyle={{ padding:'0px 24px 0px 24px'}}
				title="Planning grids"  
				children={
					<React.Fragment key="k2">
						<div style={{marginBottom:'5px'}}>There are a total of {this.props.planningGrids.length} planning grids:</div>
							<div id="projectsTable">
								<ReactTable 
								  pageSize={ this.props.planningGrids.length }
									className={'projectsReactTable noselect'}
									showPagination={false} 
									minRows={0}
									noDataText=''
									data={this.props.planningGrids}
									thisRef={this} 
									columns={tableColumns}
									getTrProps={(state, rowInfo) => {
										return {
											style: {
												background: (rowInfo.original.alias === (state.thisRef.state.selectedPlanningGrid && state.thisRef.state.selectedPlanningGrid.alias)) ? "aliceblue" : ""
											},
											onClick: (e) => {
												state.thisRef.changePlanningGrid(e, rowInfo.original);
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
								show={!this.props.unauthorisedMethods.includes("deletePlanningUnitGrid")}
								icon={<FontAwesomeIcon icon={faTrashAlt}  color='rgb(255, 64, 129)'/>} 
								title="Delete planning grid" 
								disabled={!this.state.selectedPlanningGrid || this.props.loading || (this.state.selectedPlanningGrid && this.state.selectedPlanningGrid.created_by === 'global admin')}
								onClick={this._delete.bind(this)} 
								label={"Delete"}
							/>
						</div>
					</React.Fragment>
				} 
			/>
		); //return
	}
}

export default PlanningGridsDialog;
