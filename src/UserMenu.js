import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Settings from 'material-ui/svg-icons/action/settings';
import LogOut from 'material-ui/svg-icons/action/exit-to-app';
import Help from 'material-ui/svg-icons/action/help-outline';
import Info from 'material-ui/svg-icons/action/info';
import Person from 'material-ui/svg-icons/social/person';
import {white} from 'material-ui/styles/colors';

class UserMenu extends React.Component {
  openHelpDialog(){
     
  }
   
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
          <Menu desktop={true} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}} width={'102px'}>
            <MenuItem primaryText="Settings" onClick={this.props.openOptionsDialog.bind(this)} leftIcon={<Settings color={white}/>}/>
            <MenuItem primaryText="Profile" onClick={this.props.openUserDialog} leftIcon={<Person color={white}/>}/>
            <MenuItem primaryText="Help" onClick={this.openHelpDialog.bind(this)} leftIcon={<Help color={white}/>}/>
            <MenuItem primaryText="About" onClick={this.props.openAboutDialog} leftIcon={<Info color={white}/>}/>
            <MenuItem primaryText="Log out" onClick={this.props.logout.bind(this)} leftIcon={<LogOut color={white}/>}/> 
          </Menu>
        </Popover>
      </React.Fragment>
    );
  }
}

export default UserMenu;
