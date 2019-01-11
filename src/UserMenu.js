import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import OptionsDialog from './OptionsDialog.js';
import UserDialog from './UserDialog.js';
import AboutDialog from './AboutDialog.js';
import Person from 'material-ui/svg-icons/social/person';
import Settings from 'material-ui/svg-icons/action/settings';
import LogOut from 'material-ui/svg-icons/action/exit-to-app';
import Help from 'material-ui/svg-icons/action/help-outline';
import Info from 'material-ui/svg-icons/action/info';
import {white} from 'material-ui/styles/colors';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      userDialogOpen: false,
      aboutDialogOpen: false
    };
  }
  openOptionsDialog() {
    this.props.hideUserMenu();
    this.props.hidePopup();
    this.props.openOptionsDialog();
  }
  openUserDialog() {
    this.setState({ userDialogOpen: true });
    this.props.hideUserMenu();
  }
  closeUserDialog() {
    this.setState({ userDialogOpen: false });
  }
  
  openHelpDialog(){
    
  }
  
  openAboutDialog(){
    this.setState({ aboutDialogOpen: true });
    this.props.hideUserMenu();
  }

  closeAboutDialog() {
    this.setState({ aboutDialogOpen: false });
  }
  
  render() {
    return (
      <React.Fragment>
        <IconButton title={"Logged in as " + this.props.user} onClick={this.props.showUserMenu.bind(this)} onMouseEnter={this.props.onMouseEnter} className="iconButton" style={{position: 'absolute',right: '40px'}}>
          <Person color={white}/>
        </IconButton>
        <Popover
          open={this.props.userMenuOpen} 
          anchorEl={this.props.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.props.hideUserMenu.bind(this)}
        >
          <Menu desktop={true} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}} width={'102px'}>
            <MenuItem primaryText="Settings" onClick={this.openOptionsDialog.bind(this)} leftIcon={<Settings color={white}/>}/>
            <MenuItem primaryText="Profile" onClick={this.openUserDialog.bind(this)} leftIcon={<Person color={white}/>}/>
            <MenuItem primaryText="Log out" onClick={this.props.logout.bind(this)} leftIcon={<LogOut color={white}/>}/> 
            <MenuItem primaryText="Help" onClick={this.openHelpDialog.bind(this)} leftIcon={<Help color={white}/>}/>
            <MenuItem primaryText="About" onClick={this.openAboutDialog.bind(this)} leftIcon={<Info color={white}/>}/>
          </Menu>
        </Popover>
        <OptionsDialog 
          userData={this.props.userData}
          open={this.props.optionsDialogOpen}
          closeOptionsDialog={this.props.closeOptionsDialog}
          saveOptions={this.props.saveOptions}
          savingOptions={this.props.savingOptions}
          changeBasemap={this.props.changeBasemap}
          basemaps={this.props.basemaps}
          basemap={this.props.basemap}
        />
        <UserDialog 
          userData={this.props.userData}
          open={this.state.userDialogOpen}
          closeUserDialog={this.closeUserDialog.bind(this)}
          updateUser={this.props.updateUser}
        />
        <AboutDialog 
          open={this.state.aboutDialogOpen}
          closeAboutDialog={this.closeAboutDialog.bind(this)}
        />
      </React.Fragment>
    );
  }
}

export default UserMenu;
