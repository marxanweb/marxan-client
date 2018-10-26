import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import FontAwesome from 'react-fontawesome';
import FileNew from 'material-ui/svg-icons/editor/insert-drive-file';
import Upload from 'material-ui/svg-icons/action/backup';
import Delete from 'material-ui/svg-icons/action/delete';
import Clone from 'material-ui/svg-icons/content/content-copy';
import ToolbarButton from './ToolbarButton';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.string.isRequired,
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, index) => { 
            this.setState({
                selectedIndex: index,
            });
            this.props.changeProject(event, index);
        };

        render() {
            return (
                <ComposedComponent
                  value={this.state.selectedIndex}
                  onChange={this.handleRequestChange}
                  style={{'height':'235px','overflow':'auto'}}
                >
          {this.props.children}
        </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);

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
        this.props.closeProjectsDialog();
    }
    _new() {
        this.props.openNewProjectDialog();
    }
    cloneProject(){
        this.props.cloneProject(this.state.selectedProject);
    }
    changeProject(event, project) {
        this.setState({ selectedProject: project });
    }
    render() {
        let listitems = this.props.projects && this.props.projects.map((project) => {
            let primary = <div style={{fontSize:'13px'}}>{project.name}</div>;
            var oldVersion = (project.oldVersion === 'True') ? 'OLD VERSION' : '';
            let secondary = <div style={{fontSize:'12px'}}>{project.description + " (created: " + project.createdate + ") " + oldVersion}</div>;
            return (<ListItem 
                key={project.name} 
                value={project.name} 
                primaryText={primary} 
                secondaryText={secondary} 
                innerDivStyle={{padding:'7px'}}
                style={{borderRadius:'3px'}}
            />);
        }); 
        if (!listitems) listitems = <div></div>; //to stop console warnings
        return (
            <Dialog 
                style={{display: this.props.open ? 'block' : 'none', marginLeft: '60px', left:'0px', width:'400px !important'}}
                overlayStyle={{display:'none'}} 
                className={'dialogGeneric'} 
                children={
                    <React.Fragment>
                        <SelectableList defaultValue ={this.props.project} children={listitems} changeProject={this.changeProject.bind(this)} style={{'height':'600px'}}/>
                        <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.loadingProjects || this.props.loadingProject ? 'inline-block' : 'none')}} className={'projectSpinner'}/></div>
                    </React.Fragment>
                } 
                title="Projects" 
                actions={[
                    <ToolbarButton 
                        icon={<FileNew style={{height:'20px',width:'20px'}}/>} 
                        title="New project"
                        onClick={this._new.bind(this)} 
                    />,
                    <ToolbarButton 
                        icon={<Upload style={{height:'20px',width:'20px'}}/>} 
                        title="Upload Marxan project from local machine"
                        onClick={this.props.openImportWizard} 
                    />, 
                    <ToolbarButton 
                        icon={<Clone style={{height:'20px',width:'20px'}}/>} 
                        title="Duplicate project" 
                        onClick={this.cloneProject.bind(this)} 
                        disabled={!this.state.selectedProject || this.props.loadingProjects || this.props.loadingProject}
                    />,
                    <ToolbarButton 
                        icon={<Delete color="red" style={{height:'20px',width:'20px'}}/>} 
                        title="Delete project" 
                        disabled={!this.state.selectedProject || this.props.loadingProjects || this.props.loadingProject}
                        onClick={this._delete.bind(this)}  
                    />,
                    <RaisedButton 
                        label="Open" 
                        primary={true} 
                        className="projectsBtn" 
                        style={{height:'24px'}}
                        onClick={this.load.bind(this)} 
                        disabled={!this.state.selectedProject || this.props.loadingProjects || this.props.loadingProject} 
                    />,
                ]} 
                open={this.props.open} 
                onRequestClose={this.props.closeProjectsDialog} 
                titleClassName={'dialogTitleStyle'} 
                contentStyle={{width:'400px'}}
            />
        );
    }
}

export default ProjectsDialog;
