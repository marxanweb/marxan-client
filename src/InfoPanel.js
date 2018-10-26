import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import UserMenu from './UserMenu.js';
import SelectField from 'material-ui/SelectField';
import SelectFeatures from './newProjectSteps/SelectFeatures';
import MenuItem from 'material-ui/MenuItem';
import ProjectsDialog from './ProjectsDialog.js';
import Menu from 'material-ui/svg-icons/navigation/menu';
import Texture from 'material-ui/svg-icons/image/texture';
import Settings from 'material-ui/svg-icons/action/settings';
import { white } from 'material-ui/styles/colors';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projectsDialogOpen: false, puEditing: false };
    //local variable 
    this.iucnCategories = ['None','IUCN I-II','IUCN I-IV','IUCN I-V'];
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //if the input box for renaming the project has been made visible and it has no value, then initialise it with the project name and focus it
    if (prevProps.editingProjectName === false && this.props.editingProjectName) {
      document.getElementById("projectName").value = this.props.project;
      document.getElementById("projectName").focus();
    }
    //if the input box for renaming the description has been made visible and it has no value, then initialise it with the description and focus it
    if (prevProps.editingDescription === false && this.props.editingDescription) {
      document.getElementById("descriptionEdit").value = this.props.metadata.DESCRIPTION;
      document.getElementById("descriptionEdit").focus();
    }
    if (prevProps.loadingProject && this.props.loadingProject === false) {
      this.closeProjectsDialog();
    }
  }
  openProjectsDialog() {
    this.setState({ projectsDialogOpen: true });
    this.props.listProjects();
  }
  closeProjectsDialog() {
    this.setState({ projectsDialogOpen: false });
  }
  loadProject(project) {
    this.props.loadProject(project);
  }
  showUserMenu(e) {
    e.preventDefault();
    this.setState({ userMenuOpen: true, anchorEl: e.currentTarget });
  }
  hideUserMenu(e) {
    e && e.preventDefault && e.preventDefault();
    this.setState({ userMenuOpen: false });
  }
  logout() {
    this.hideUserMenu();
    this.props.logout();
  }

  onKeyPress(e) {
    if (e.nativeEvent.keyCode === 13 || e.nativeEvent.keyCode === 27) {
      document.getElementById(e.nativeEvent.target.id).blur(); //call the onBlur event which will call the REST service to rename the project
    }
  }

  onBlur(e) {
    if (e.nativeEvent.target.id === 'projectName') {
      this.props.renameProject(e.target.value);
    }
    else {
      this.props.renameDescription(e.target.value);
    }
  }

  startEditingProjectName() {
    if (this.props.project) { //a project may not be loaded
      this.props.startEditingProjectName();
    }
  }
  startEditingDescription() {
    if (this.props.project) { //a project may not be loaded
      this.props.startEditingDescription();
    }
  }
  project_tab_active() {
    this.props.project_tab_active();
  }
  features_tab_active() {
    this.props.features_tab_active();
  }
  pu_tab_active() {
    this.props.pu_tab_active();
  }
  startStopPuEditSession(evt) {
    (this.state.puEditing) ? this.stopPuEditSession(): this.startPuEditSession();
  }
  startPuEditSession() {
    this.setState({ puEditing: true });
    this.props.startPuEditSession();
  }

  stopPuEditSession() {
    this.setState({ puEditing: false});
    this.props.stopPuEditSession();
  }
  showSettingsDialog() {
    this.props.showSettingsDialog();
  }
  
  changeIucnCategory(event,key,payload){
    this.props.changeIucnCategory(this.iucnCategories[key]);
  }
  
  render() {
    return (
      <React.Fragment>
        <div className={'infoPanel'} style={{display: this.props.loggedIn ? 'block' : 'none'}}>
          <Paper zDepth={2} className="InfoPanelPaper">
            <Paper zDepth={2} className="titleBar">
              <IconButton title="Click to open projects" onClick={this.openProjectsDialog.bind(this)} className="iconButton projectButton">
                <Menu color={white}/>
              </IconButton>
              <span onClick={this.startEditingProjectName.bind(this)} className={'projectNameEditBox'} title="Click to rename the project">{this.props.project}</span>
              <input id="projectName" style={{position:'absolute', 'display': (this.props.editingProjectName) ? 'block' : 'none',left:'63px',top:'33px',border:'1px lightgray solid'}} className={'projectNameEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>
              <UserMenu 
                    user={ this.props.user} 
                    userData={this.props.userData}
                    loggedIn={this.props.loggedIn}
                    onMouseEnter={this.showUserMenu.bind(this)} 
                    showUserMenu={this.showUserMenu.bind(this)} 
                    userMenuOpen={this.state.userMenuOpen} 
                    anchorEl={this.state.anchorEl} 
                    hideUserMenu={this.hideUserMenu.bind(this)} 
                    logout={this.logout.bind(this)}
                    loadingProject={this.props.loadingProject}
                    loadingProjects={this.props.loadingProjects}
                    listProjects={this.props.listProjects}
                    projects={this.props.projects}
                    project={this.props.project}
                    deleteProject={this.props.deleteProject}
                    loadProject={this.props.loadProject}
                    cloneProject={this.props.cloneProject}
                    saveOptions={this.props.saveOptions}
                    savingOptions={this.props.savingOptions}
                    openOptionsDialog={this.props.openOptionsDialog}
                    closeOptionsDialog={this.props.closeOptionsDialog}
                    optionsDialogOpen={this.props.optionsDialogOpen}
                    openNewProjectDialog={this.props.openNewProjectDialog}
                    hidePopup={this.props.hidePopup}
                    updateUser={this.props.updateUser}
                    openImportWizard={this.props.openImportWizard} 
              />
            </Paper>
            <Tabs contentContainerStyle={{'margin':'20px'}} className={'tabs'} value={this.props.activeTab}>
              <Tab label="Project" onActive={this.project_tab_active.bind(this)} value="project">
                <div>
                  <div className={'tabTitle'}>Description</div>
                  <input id="descriptionEdit" style={{'display': (this.props.editingDescription) ? 'block' : 'none'}} className={'descriptionEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>
                  <div className={'description'} onClick={this.startEditingDescription.bind(this)} style={{'display': (!this.props.editingDescription) ? 'block' : 'none'}}>{this.props.metadata.DESCRIPTION}</div>
                  <div className={'tabTitle'}>Created</div>
                  <div className={'createDate'}>{this.props.metadata.CREATEDATE}</div>
                </div>
              </Tab>
              <Tab label="Features" onActive={this.features_tab_active.bind(this)} value="features">
                <SelectFeatures
                  features={this.props.features}
                  updateTargetValue={this.props.updateTargetValue}
                  preprocessFeature={this.props.preprocessFeature}
                  openAllInterestFeaturesDialog={this.props.openAllInterestFeaturesDialog}
                  simple={false}
                />
              </Tab>
              <Tab label="Planning units" onActive={this.pu_tab_active.bind(this)} value="planning_units">
                <div>
                  <div className={'tabTitle'}>Planning area</div>
                  <div className={'description'}>{this.props.metadata.pu_alias}</div>
                  <div className={'tabTitle'}>Protected areas</div>
                  <SelectField 
                    floatingLabelText={'Include'} 
                    floatingLabelFixed={true} 
                    underlineShow={false}
                    disabled={this.props.preprocessingProtectedAreas}
                    menuItemStyle={{fontSize:'12px'}}
                    labelStyle={{fontSize:'12px'}} 
                    style={{marginTop:'-15px',width:'140px'}}
                    value={this.props.metadata.IUCN_CATEGORY} 
                    onChange={this.changeIucnCategory.bind(this)}
                    children= {this.iucnCategories.map((item)=> {
                      return  <MenuItem 
                        value={item} 
                        key={item} 
                        primaryText={item}
                        style={{fontSize:'12px'}}
                        />;
                    })}
                  />
                  <div>
                    <span className={'tabTitle'} style={{verticalAlign:'middle'}}>Click to {this.state.puEditing ? "save" : "change"} planning unit status</span>
                    <Texture  
                      title='Add/remove  planning units from analysis'
                      onClick={this.startStopPuEditSession.bind(this)}
                      style={{color: this.state.puEditing ? 'rgb(255, 64, 129)' : 'rgb(150, 150, 150)', cursor:'pointer', display:'inline-flex',verticalAlign:'middle',marginLeft: '10px'}}
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>     
            <Paper className={'lowerToolbar'}>
                <RaisedButton 
                  icon={<Settings style={{height:'20px',width:'20px'}}/>} 
                  title="Run Settings"
                  onClick={this.showSettingsDialog.bind(this)} 
                  style={{ marginLeft:'12px', marginRight:'4px',padding: '0px',minWidth: '30px',width: '24px',height: '24px',position:'absolute'}}
                  overlayStyle={{lineHeight:'24px',height:'24px'}}
                  buttonStyle={{marginTop:'-7px',lineHeight:'24px',height:'24px'}} 
                />
                <div style={{position:'absolute',right:'40px'}}>
                  <RaisedButton 
                    label="Run" 
                    title="Click to run this project" 
                    secondary={true} 
                    className="projectsBtn" 
                    style={{height:'24px'}}
                    onClick={this.props.runMarxan} 
                    disabled={!this.props.runnable || this.props.preprocessingFeature || this.props.running || (this.props.features.length === 0) || this.state.puEditing} 
                  />  
                </div>
            </Paper>
            <div className='footer'>
              <div>v1.0 Feedback: <a href='mailto:andrew.cottam@ec.europa.eu' className='email'>Andrew Cottam</a></div>
              <div>Marxan 2.4.3 - Ian Ball, Matthew Watts &amp; Hugh Possingham</div>
            </div>
          </Paper>
        </div>
          <ProjectsDialog 
            open={this.state.projectsDialogOpen} 
            loadingProjects={this.props.loadingProjects}
            loadingProject={this.props.loadingProject}
            closeProjectsDialog={this.closeProjectsDialog.bind(this)}
            projects={this.props.projects}
            project={this.props.project}
            deleteProject={this.props.deleteProject}
            loadProject={this.loadProject.bind(this)}
            cloneProject={this.props.cloneProject}
            openNewProjectDialog={this.props.openNewProjectDialog}
            openImportWizard={this.props.openImportWizard}
          />
      </React.Fragment>
    );
  }
}

export default InfoPanel;
