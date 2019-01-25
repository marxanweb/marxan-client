import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Import from 'material-ui/svg-icons/action/get-app';
import Delete from 'material-ui/svg-icons/action/delete';
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
        if ((this.props.oldVersion === true)&&(this.state.selectedProject.oldVersion === false)){
            //get all the features again otherwise the allFeatures state will be bound to the old versions features
            this.props.getAllFeatures().then(function(){
                this.loadAndClose();
            }.bind(this));
        }else{
            this.loadAndClose();
        }
    }
    loadAndClose(){
        //load the project
        this.props.loadProject(this.state.selectedProject.name, this.state.selectedProject.user);
        this.closeDialog();
    }
    _new() {
        this.props.openNewProjectDialog();
        this.closeDialog();
    }
    cloneProject(){
        this.props.cloneProject(this.state.selectedProject.user, this.state.selectedProject.name); 
    }
    openImportDialog(){ 
        this.props.openImportDialog();
        this.closeDialog();
    }
    changeProject(event, project) {
        this.setState({ selectedProject: project });
    }
    closeDialog(){
        this.setState({selectedProject: undefined});
        this.props.onOk();
    }
    render() {
        let tableColumns = [];
        if (['Admin','ReadOnly'].includes(this.props.userRole)){
            tableColumns = [{Header:'User',accessor:'user',width:90,headerStyle:{'textAlign':'left'}}, {Header:'Name',accessor:'name',width:200,headerStyle:{'textAlign':'left'}},{Header:'Description',accessor:'description',width:250,headerStyle:{'textAlign':'left'}},{Header:'Date',accessor:'createdate',width:110,headerStyle:{'textAlign':'left'}}];
        }else{
            tableColumns = [{Header:'Name',accessor:'name',width:170,headerStyle:{'textAlign':'left'}},{Header:'Description',accessor:'description',width:330,headerStyle:{'textAlign':'left'}},{Header:'Date',accessor:'createdate',width:150,headerStyle:{'textAlign':'left'}}];
        }
        if (this.props.projects){
            return ( 
                <MarxanDialog 
                    {...this.props} 
                    // titleBarIcon={faBookOpen}
                    showSpinner={(this.props.loadingProjects || this.props.loadingProject)}
                    okLabel={(this.props.userRole === "ReadOnly") ? "Open (Read-only)" : "Open"}
                    onOk={this.load.bind(this)}
                    onCancel={this.closeDialog.bind(this)}
                    okDisabled={!this.state.selectedProject}
                    showCancelButton={true}
                    autoDetectWindowHeight={false}
                    bodyStyle={{ padding:'0px 24px 0px 24px'}}
                    title="Projects"  
                    children={
                        <React.Fragment>
                            <div style={{marginBottom:'5px'}}>There are a total of {this.props.projects.length} projects:</div>
                                <div id="projectsTable">
                                    <ReactTable 
                                        pageSize={15}
                                        className={'projectsReactTable'}
                                        showPagination={false} 
                                        minRows={0}
                                        data={this.props.projects}
                                        thisRef={this}
                                        columns={tableColumns}
                                        getTrProps={(state, rowInfo, column) => {
                                            return {
                                                style: {
                                                    background: (rowInfo.original.name === (state.thisRef.state.selectedProject&&state.thisRef.state.selectedProject.name)) ? "aliceblue" : ""
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
                                    disabled={!this.state.selectedProject || this.props.loadingProjects || this.props.loadingProject}
                                    label={"Duplicate"}
                                /> 
                                <ToolbarButton  
                                    show={!this.props.unauthorisedMethods.includes("deleteProject")}
                                    icon={<Delete color="red" style={{height:'20px',width:'20px'}}/>} 
                                    title="Delete project" 
                                    disabled={!this.state.selectedProject || this.props.loadingProjects || this.props.loadingProject}
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
