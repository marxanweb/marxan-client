import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import SelectFeatures from './newProjectSteps/SelectFeatures';
import MenuItem from 'material-ui/MenuItem';
import Texture from 'material-ui/svg-icons/image/texture';
import Settings from 'material-ui/svg-icons/action/settings';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {puEditing: false };
    //local variable 
    this.iucnCategories = ['None','IUCN I-II','IUCN I-IV','IUCN I-V','IUCN I-VI'];
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
  
  changeIucnCategory(event,key,payload){
    this.props.changeIucnCategory(this.iucnCategories[key]);
  }
  
  render() {
    return (
      <React.Fragment>  
        <div className={'infoPanel'} style={{display: this.props.open ? 'block' : 'none'}}>
          <Paper zDepth={2} className="InfoPanelPaper">
            <Paper zDepth={2} className="titleBar">
              {(this.props.userRole === "ReadOnly") ? <span className={'projectNameEditBox'} title={this.props.project + " (Read-only)"}>{this.props.project} (Read-only)</span> : <span onClick={this.startEditingProjectName.bind(this)} className={'projectNameEditBox'} title="Click to rename the project">{this.props.project}</span>}
              {(this.props.userRole === "ReadOnly") ? null : <input id="projectName" style={{position:'absolute', 'display': (this.props.editingProjectName) ? 'block' : 'none',left:'39px',top:'32px',width:'365px', border:'1px lightgray solid'}} className={'projectNameEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>}
            </Paper>
            <Tabs contentContainerStyle={{'margin':'20px'}} className={'tabs'} value={this.props.activeTab}>
              <Tab label="Project" onActive={this.props.project_tab_active} value="project">
                <div>
                  <div className={'tabTitle'}>Description</div>
                  {(this.props.userRole === "ReadOnly") ? null : <input id="descriptionEdit" style={{'display': (this.props.editingDescription) ? 'block' : 'none'}} className={'descriptionEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>}
                  {(this.props.userRole === "ReadOnly") ? <div className={'description'} title={this.props.metadata.DESCRIPTION}>{this.props.metadata.DESCRIPTION}</div> : <div className={'description'} onClick={this.startEditingDescription.bind(this)} style={{'display': (!this.props.editingDescription) ? 'block' : 'none'}} title="Click to edit">{this.props.metadata.DESCRIPTION}</div>}
                  <div className={'tabTitle'}>Created</div>
                  <div className={'createDate'}>{this.props.metadata.CREATEDATE}</div>
                  <div className={'tabTitle'}>{(this.props.metadata.OLDVERSION) ? "Imported project" : ""}</div>
                </div>
              </Tab>
              <Tab label="Features" onActive={this.props.features_tab_active} value="features">
                <SelectFeatures
                  features={this.props.features}
                  openFeatureMenu={this.props.openFeatureMenu}
                  openFeaturesDialog={this.props.openFeaturesDialog} 
                  metadata={this.props.metadata}
                  updateFeature={this.props.updateFeature}
                  leftmargin={'10px'}
                  simple={false}
                  userRole={this.props.userRole}
                />
              </Tab>
              <Tab label="Planning units" onActive={this.props.pu_tab_active} value="planning_units">
                <div>
                  <div className={'tabTitle'}>Planning area</div>
                  <div className={'description'}>{this.props.metadata.pu_alias}</div>
                  <div className={'tabTitle'}>Protected areas</div>
                  <SelectField 
                    floatingLabelText={'Include'} 
                    floatingLabelFixed={true} 
                    underlineShow={false}
                    disabled={(this.props.preprocessingProtectedAreas)||(this.props.userRole === "ReadOnly")}
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
                  <div style={{display: (this.props.userRole === "ReadOnly") ? 'none' : 'block'}}>
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
                  onClick={this.props.showRunSettingsDialog} 
                  style={{ marginLeft:'12px', marginRight:'4px',padding: '0px',minWidth: '30px',width: '24px',height: '24px'}}
                  overlayStyle={{lineHeight:'24px',height:'24px'}}
                  buttonStyle={{marginTop:'-7px',lineHeight:'24px',height:'24px'}} 
                />
                <RaisedButton 
                  label="Stop" 
                  title="Click to stop this project"  
                  secondary={true} 
                  className="projectsBtn" 
                  style={{display: (this.props.userRole === "ReadOnly") ? 'none' : 'inline-block', height:'24px', marginLeft: '194px'}}
                  onClick={this.props.stopMarxan} 
                  disabled={this.props.pid===0}  
                />  
                <RaisedButton 
                  label="Run" 
                  title="Click to run this project"  
                  secondary={true} 
                  className="projectsBtn" 
                  style={{display: (this.props.userRole === "ReadOnly") ? 'none' : 'inline-block', height:'24px'}}
                  onClick={this.props.runMarxan} 
                  disabled={!this.props.runnable || this.props.preprocessingFeature || this.props.running || (this.props.features.length === 0) || this.state.puEditing}  
                />  
            </Paper>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default InfoPanel;
