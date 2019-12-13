import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBookOpen} from '@fortawesome/free-solid-svg-icons';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {faThLarge} from '@fortawesome/free-solid-svg-icons';
import {faArrowAltCircleLeft} from '@fortawesome/free-solid-svg-icons';
import {faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons'; 
import {faArrowAltCircleLeft as a} from '@fortawesome/free-regular-svg-icons';
import {faArrowAltCircleRight as b} from '@fortawesome/free-regular-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {faRunning} from '@fortawesome/free-solid-svg-icons';
import {faGraduationCap} from '@fortawesome/free-solid-svg-icons';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';

class AppBar extends React.Component {
	constructor (props){
		super(props);
		this.state = {adminMenuOpen: false};
	}
	//opens the features dialog without the ability to add/remove features (i.e. different from the dialog that is opened from a project)
  openFeaturesDialog(evt) {
    this.props.openFeaturesDialog(false);
 }
  //opens the admin menu
  openAdminMenu(evt){
  	this.setState({adminMenuOpen: true, menuAnchor: evt.currentTarget});
 }
  //closes the admin menu
 closeAdminMenu(evt){
  	this.setState({adminMenuOpen: false});
 }
 openUsersDialog(){
		this.props.openUsersDialog();
		this.closeAdminMenu();
 }
 openRunLogDialog(){
		this.props.openRunLogDialog();
		this.closeAdminMenu();
 }
 openAnalysisDialog(){
		this.props.openAnalysisDialog();
		this.closeAdminMenu();
 }
  render() {
    return (
      <React.Fragment>
        <Toolbar style={{display: (this.props.open) ? 'block' : 'none', backgroundColor: 'rgb(0, 188, 212)', height: '36px', padding: '0px 18px'}} className={'appBar'}>
        	<ToolbarGroup>
            <FontAwesomeIcon icon={faBookOpen} onClick={this.props.openProjectsDialog} title="Projects" className={'appBarIcon'} style={{fontSize: '20px'}}/>
            <FontAwesomeIcon icon={faStar} onClick={this.openFeaturesDialog.bind(this)} title="Features" className={'appBarIcon'} style={{fontSize: '20px'}}/>
            <FontAwesomeIcon icon={faThLarge} onClick={this.props.openPlanningGridsDialog.bind(this)} title="Planning grids" className={'appBarIcon'} style={{fontSize: '20px'}}/>
            <ToolbarSeparator style={{marginLeft:'12px', marginRight:'12px'}}/>
            <FontAwesomeIcon style={{fontSize: '20px'}} icon={(this.props.infoPanelOpen) ? faArrowAltCircleLeft : a} onClick={this.props.toggleInfoPanel} title={(this.props.infoPanelOpen) ? "Hide the project window" : "Show the project window"} className={'appBarIcon'}/>
            <FontAwesomeIcon style={{fontSize: '20px'}} icon={(this.props.resultsPanelOpen) ? faArrowAltCircleRight : b} onClick={this.props.toggleResultsPanel} title={(this.props.resultsPanelOpen) ? "Hide the results window" : "Show the results window"} className={'appBarIcon'} />
            <ToolbarSeparator style={{marginLeft:'12px', marginRight:'12px'}}/>
            <FontAwesomeIcon icon={faUser} onClick={this.props.showUserMenu} title={"User: " + this.props.user + " (" + this.props.userRole + ")"} className={'appBarIcon'} style={{fontSize: '20px'}}/>
            <div className={'adminDiv appBarIcon'} onClick={this.openAdminMenu.bind(this)} style={{display: (this.props.userRole === 'Admin') ? 'inline-block' : 'none'}}>Admin</div>
	          <Popover open={this.state.adminMenuOpen} anchorEl={this.state.menuAnchor} onRequestClose={this.closeAdminMenu.bind(this)}>
	            <Menu desktop={true} onMouseLeave={this.closeAdminMenu.bind(this)} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}}>
	              <MenuItem leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faUsers} color={'white'}/>} onClick={this.openUsersDialog.bind(this)} title={"Manage Users"}>Users</MenuItem>
	              <MenuItem leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faRunning} color={'white'}/>} onClick={this.openRunLogDialog.bind(this)} title={"View Run Log and stop runs"}>Run log</MenuItem>
	              <MenuItem leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faGraduationCap} color={'white'}/>} onClick={this.openAnalysisDialog.bind(this)} title={"Analysis and Evaluation"}>Analysis and Evaluation</MenuItem>
	            </Menu>
	          </Popover>   
            <FontAwesomeIcon icon={faQuestionCircle} onClick={this.props.showHelpMenu} title={"Help and support"} className={'appBarIcon'} style={{fontSize: '20px'}}/>
          </ToolbarGroup>
        </Toolbar>
      </React.Fragment>
      );
 }
}

export default AppBar;
