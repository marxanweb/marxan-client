import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import Import from 'material-ui/svg-icons/action/get-app';
import Clone from 'material-ui/svg-icons/content/content-copy';
import ToolbarButton from './ToolbarButton';
import MarxanDialog from './MarxanDialog';
import ReactTable from "react-table";

class ProjectsDialog extends React.Component { 
		constructor(props) {
			super(props);
			this.state = { selectedProject: undefined };
		}
		_delete() {
			this.props.deleteProject(this.state.selectedProject.user, this.state.selectedProject.name);
			this.setState({ selectedProject: false });
		}
		load() {
			if ((this.props.oldVersion === true) && (this.state.selectedProject.oldVersion === false)) {
				//get all the features again otherwise the allFeatures state will be bound to the old versions features
				this.props.getAllFeatures().then(function() {
					this.loadAndClose();
				}.bind(this));
			}
			else {
				this.loadAndClose();
			}
		}
		loadAndClose() {
			//load the project
			this.props.loadProject(this.state.selectedProject.name, this.state.selectedProject.user);
			this.closeDialog();
		}
		_new() {
			//get all the features again otherwise the allFeatures state may be bound to an old version of marxans features
			this.props.getAllFeatures().then(function() {
				this.props.openNewProjectDialog();
				this.closeDialog();
			}.bind(this));
		}
		cloneProject() {
			this.props.cloneProject(this.state.selectedProject.user, this.state.selectedProject.name);
		}
		openImportDialog() {
			this.props.openImportDialog();
			this.closeDialog();
		}
		changeProject(event, project) {
			this.setState({ selectedProject: project });
		}
		closeDialog() {
			this.setState({ selectedProject: undefined });
			this.props.onOk(); 
		}
		sortDate(a, b, desc){
			return (new Date(a.slice(6,8),a.slice(3,5)-1,a.slice(0,2),a.slice(9,11),a.slice(12,14),a.slice(15,17)) > new Date(b.slice(6,8),b.slice(3,5)-1,b.slice(0,2),b.slice(9,11),b.slice(12,14),b.slice(15,17))) ? 1 : -1;
		}
		renderTitle(row){
			return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.description}>{row.original.description}</div>;        
		}
		renderName(row){
			return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.name}>{row.original.name}</div>;        
		}
		render() {
				let tableColumns = [];
				if (['Admin', 'ReadOnly'].includes(this.props.userRole)) {
					tableColumns = [{ Header: 'User', accessor: 'user', width: 90, headerStyle: { 'textAlign': 'left' } }, { Header: 'Name', accessor: 'name', width: 200, headerStyle: { 'textAlign': 'left' }, Cell: this.renderName.bind(this) }, { Header: 'Description', accessor: 'description', width: 315, headerStyle: { 'textAlign': 'left' }, Cell: this.renderTitle.bind(this) }, { Header: 'Date', accessor: 'createdate', width: 115, headerStyle: { 'textAlign': 'left' }, sortMethod: this.sortDate.bind(this)}];
				}
				else {
					tableColumns = [{ Header: 'Name', accessor: 'name', width: 170, headerStyle: { 'textAlign': 'left' }, Cell: this.renderName.bind(this) }, { Header: 'Description', accessor: 'description', width: 330, headerStyle: { 'textAlign': 'left' }, Cell: this.renderTitle.bind(this) }, { Header: 'Date', accessor: 'createdate', width: 220, headerStyle: { 'textAlign': 'left' }, sortMethod: this.sortDate.bind(this) }];
				}
				if (this.props.projects) {
					return (
					<MarxanDialog 
					{...this.props} 
					// titleBarIcon={faBookOpen}
					okLabel={(this.props.userRole === "ReadOnly") ? "Open (Read-only)" : "Open"}
					onOk={this.load.bind(this)}
					onCancel={this.closeDialog.bind(this)}
					okDisabled={!this.state.selectedProject}
					showCancelButton={true}
					helpLink={"docs_user.html#the-projects-window"}
					autoDetectWindowHeight={false}
					bodyStyle={{ padding:'0px 24px 0px 24px'}}
					title="Projects"  
					children={
						<React.Fragment key="k2">
							<div style={{marginBottom:'5px'}}>There are a total of {this.props.projects.length} projects:</div>
								<div id="projectsTable">
									<ReactTable 
									  pageSize={ this.props.projects.length }
										className={'projectsReactTable noselect'}
										showPagination={false} 
										minRows={0}
										noDataText=''
										data={this.props.projects}
										thisRef={this} 
										columns={tableColumns}
										getTrProps={(state, rowInfo, column) => {
											return {
												style: {
													background: ((rowInfo.original.user === (state.thisRef.state.selectedProject&&state.thisRef.state.selectedProject.user))&&(rowInfo.original.name === (state.thisRef.state.selectedProject&&state.thisRef.state.selectedProject.name))) ? "aliceblue" : ""
												},
												onClick: (e) => {
													state.thisRef.changeProject(e, rowInfo.original);
												}
											};
										}}
									/>
							  </div>
							  <div id="projectsToolbar" style={{display: (this.props.userRole === "ReadOnly") ? 'none' : 'block'}}>
								<ToolbarButton 
									show={!this.props.unauthorisedMethods.includes("createProject")}
									icon={<FontAwesomeIcon icon={faPlusCircle} />} 
									title="New project" 
									onClick={this._new.bind(this)} 
									label={"New"}
								/>
								<ToolbarButton 
									show={!this.props.unauthorisedMethods.includes("createImportProject")}
									icon={<Import style={{height:'20px',width:'20px'}}/>} 
									title="Import an existing Marxan project from the local machine"
									onClick={this.openImportDialog.bind(this)} 
									label={"Import"}
								/>
								<ToolbarButton 
									show={!this.props.unauthorisedMethods.includes("cloneProject")}
									icon={<Clone style={{height:'20px',width:'20px'}}/>} 
									title="Duplicate project" 
									onClick={this.cloneProject.bind(this)} 
									disabled={!this.state.selectedProject || this.props.loading}
									label={"Duplicate"}
								/> 
								<ToolbarButton  
									show={!this.props.unauthorisedMethods.includes("deleteProject")}
									icon={<FontAwesomeIcon icon={faTrashAlt}  color='rgb(255, 64, 129)'/>} 
									title="Delete project" 
									disabled={!this.state.selectedProject || this.props.loading}
									onClick={this._delete.bind(this)} 
									label={"Delete"}
								/>
							  </div>
						</React.Fragment>
					} 
				/>
			);
		}else{
			return null;
		}
	}
}

export default ProjectsDialog;
