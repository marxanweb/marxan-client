import React from 'react';
import Menu from 'material-ui/Menu'; 
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {faRunning} from '@fortawesome/free-solid-svg-icons';
import {faChartBar} from '@fortawesome/free-solid-svg-icons';

class ToolsMenu extends React.Component { 
 openUsersDialog(){
		this.props.openUsersDialog();
		this.props.hideToolsMenu();
 }
 openRunLogDialog(){
		this.props.openRunLogDialog();
		this.props.hideToolsMenu();
 }
 openGapAnalysisDialog(){
		this.props.openGapAnalysisDialog();
		this.props.hideToolsMenu();
 }
	render() { 
		return (
			<React.Fragment> 
	          <Popover open={this.props.open} anchorEl={this.props.menuAnchor} onRequestClose={this.props.hideToolsMenu}>
	            <Menu desktop={true} onMouseLeave={this.props.hideToolsMenu} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}}>
	              <MenuItem style={{display: (this.props.userRole === 'Admin') ? 'inline-block' : 'none'}} leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faUsers} color={'white'}/>} onClick={this.openUsersDialog.bind(this)} title={"Manage Users"}>Users</MenuItem>
	              <MenuItem leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faRunning} color={'white'}/>} onClick={this.openRunLogDialog.bind(this)} title={(this.props.userRole === 'Admin') ? "View Run Log and stop runs" : "View Run Log"}>Run log</MenuItem>
	              <MenuItem style={{display: (this.props.userRole !== 'ReadOnly') ? 'inline-block' : 'none'}} leftIcon={<FontAwesomeIcon style={{fontSize: '20px'}} icon={faChartBar} color={'white'}/>} onClick={this.openGapAnalysisDialog.bind(this)} title={"Gap Analysis"} disabled={this.props.metadata.pu_country===null}>{(this.props.metadata.pu_country===null) ? 'Gap Analysis (not available)' : 'Gap Analysis'}</MenuItem>
	            </Menu>
	          </Popover>   
			</React.Fragment>
		); 
	}
}

export default ToolsMenu;
