import React from 'react';
import FontAwesome from 'react-fontawesome';
import FileNew from 'material-ui/svg-icons/file/create-new-folder';
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
        this.props.deleteProject(this.state.selectedProject); 
        this.setState({ selectedProject: false });
    }
    load() {
        this.props.loadProject(this.state.selectedProject);
        this.closeDialog();
    }
    _new() {
        this.props.openNewProjectDialog();
        this.closeDialog();
    }
    cloneProject(){
        this.props.cloneProject(this.state.selectedProject);
    }
    openImportWizard(){
        this.props.openImportWizard();
        this.closeDialog();
    }
    changeProject(event, project) {
        this.setState({ selectedProject: project.name });
    }
    closeDialog(){
        this.setState({selectedProject: undefined});
        this.props.onOk();
    }
    render() {
        if (this.props.projects){
            return (
                <MarxanDialog 
                    {...this.props} 
                    okLabel="Open"
                    autoDetectWindowHeight={false}
                    // contentStyle={{width:'700px'}}
                    bodyStyle={{ padding:'0px 24px 0px 24px'}}
                    title="Projects"  
                    onOk={this.load.bind(this)}
                    onCancel={this.closeDialog.bind(this)}
                    showCancelButton={true}
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
                                        columns={[{
                                           Header: 'Name', 
                                           accessor: 'name',
                                           width:170,
                                           headerStyle:{'textAlign':'left'},
                                        },{
                                           Header: 'Description',
                                           accessor: 'description',
                                           width:330,
                                           headerStyle:{'textAlign':'left'},
                                        },{
                                           Header: 'Date',
                                           accessor: 'createdate',
                                           width:150,
                                           headerStyle:{'textAlign':'left'},
                                        }
                                        ]}
                                        getTrProps={(state, rowInfo, column) => {
                                            return {
                                                style: {
                                                    background: (rowInfo.original.name === state.thisRef.state.selectedProject) ? "aliceblue" : ""
                                                },
                                                onClick: (e) => {
                                                    state.thisRef.changeProject(e, rowInfo.original);
                                                }
                                            };
                                        }}
                                    />
                              </div>
                              <div id="projectsToolbar">
                                <ToolbarButton 
                                    icon={<FileNew style={{height:'20px',width:'20px'}}/>} 
                                    title="New project"
                                    onClick={this._new.bind(this)} 
                                    label={"New"}
                                />
                                <ToolbarButton 
                                    icon={<Import style={{height:'20px',width:'20px'}}/>} 
                                    title="Import an existing Marxan project from the local machine"
                                    onClick={this.openImportWizard.bind(this)} 
                                    label={"Import"}
                                />
                                <ToolbarButton 
                                    icon={<Clone style={{height:'20px',width:'20px'}}/>} 
                                    title="Duplicate project" 
                                    onClick={this.cloneProject.bind(this)} 
                                    disabled={!this.state.selectedProject || this.props.loadingProjects || this.props.loadingProject}
                                    label={"Duplicate"}
                                />
                                <ToolbarButton 
                                    icon={<Delete color="red" style={{height:'20px',width:'20px'}}/>} 
                                    title="Delete project" 
                                    disabled={!this.state.selectedProject || this.props.loadingProjects || this.props.loadingProject}
                                    onClick={this._delete.bind(this)} 
                                    label={"Delete"}
                                />
                              </div>
                            <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.loadingProjects || this.props.loadingProject ? 'inline-block' : 'none')}} className={'projectSpinner'}/></div>
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
