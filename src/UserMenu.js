import React from 'react';
import Menu from 'material-ui/Menu'; 
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Settings from 'material-ui/svg-icons/action/settings';
import LogOut from 'material-ui/svg-icons/action/exit-to-app';
import Person from 'material-ui/svg-icons/social/person';
import {white} from 'material-ui/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlink } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

class UserMenu extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Popover
          open={this.props.userMenuOpen} 
          anchorEl={this.props.menuAnchor}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.props.hideUserMenu}
        >
          <Menu desktop={true} onMouseLeave={this.props.hideUserMenu} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}} width={50}>
            <MenuItem primaryText={"Server: " + (this.props.marxanServer && this.props.marxanServer.name)} leftIcon={(this.props.marxanServer && this.props.marxanServer.offline) ? <FontAwesomeIcon style={{height: '16px', marginTop:'4px'}} icon={faUnlink}/> : (this.props.marxanServer && this.props.marxanServer.corsEnabled) ? null : <FontAwesomeIcon style={{color: 'white', height: '16px', marginTop:'4px'}} icon={faLock}/>}/>
            <MenuItem primaryText={"Logged in as: " + this.props.user + " (" + this.props.userRole + ")"}/>
            <MenuItem style={{display: (this.props.userRole !== "ReadOnly") ? 'block' : 'none'}} primaryText="Settings" onClick={this.props.openOptionsDialog.bind(this)} leftIcon={<Settings color={white}/>}/>
            <MenuItem style={{display: (this.props.userRole !== "ReadOnly") ? 'block' : 'none'}} primaryText="Profile" onClick={this.props.openProfileDialog} leftIcon={<Person color={white}/>}/>
            <MenuItem primaryText="Log out" onClick={this.props.logout.bind(this)} leftIcon={<LogOut color={white}/>}/> 
          </Menu>
        </Popover>
      </React.Fragment>
    ); 
  }
}

export default UserMenu;
