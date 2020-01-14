import React from 'react';
import Menu from 'material-ui/Menu'; 
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {faRunning} from '@fortawesome/free-solid-svg-icons';
import {faGraduationCap} from '@fortawesome/free-solid-svg-icons';

class ToolsMenu extends React.Component { 
 openUsersDialog(){
		this.props.openUsersDialog();
		this.props.hideToolsMenu();
 }
 openRunLogDialog(){
		this.props.openRunLogDialog();
		this.props.hideToolsMenu();
 }
 openAnalysisDialog(){
		this.props.openAnalysisDialog();
		this.props.hideToolsMenu();
 }
	render() { 
		return (
			<React.Fragment> 
	          <Popover open={this.props.open} anchorEl={this.props.menuAnchor} onRequestClose={this.props.hideToolsMenu}>
	            <Menu desktop={true} onMouseLeave={this.props.hideToolsMenu} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}}>
	              <MenuItem style={{display: (this.props.userRole === 'Admin') ? 'inline-block' : 'none'}} leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faUsers} color={'white'}/>} onClick={this.openUsersDialog.bind(this)} title={"Manage Users"}>Manage Users</MenuItem>
	              <MenuItem style={{display: (this.props.userRole === 'Admin') ? 'inline-block' : 'none'}} leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faRunning} color={'white'}/>} onClick={this.openRunLogDialog.bind(this)} title={"View Run Log and stop runs"}>Run log</MenuItem>
	              <MenuItem leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faGraduationCap} color={'white'}/>} onClick={this.openAnalysisDialog.bind(this)} title={"Analysis and Evaluation"}>Analysis and Evaluation</MenuItem>
	            </Menu>
	          </Popover>   
			</React.Fragment>
		); 
	}
}

export default ToolsMenu;
