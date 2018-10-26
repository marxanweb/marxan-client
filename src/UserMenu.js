import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import OptionsDialog from './OptionsDialog.js';
import UserDialog from './UserDialog.js';
import Person from 'material-ui/svg-icons/social/person';
import Settings from 'material-ui/svg-icons/action/settings';
import LogOut from 'material-ui/svg-icons/action/exit-to-app';
import {white} from 'material-ui/styles/colors';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userDialogOpen: false };
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
            <MenuItem primaryText={"Logged in as " + this.props.user}/>
            <MenuItem primaryText="Options" onClick={this.openOptionsDialog.bind(this)} leftIcon={<Settings color={white}/>}/>
            <MenuItem primaryText="Profile" onClick={this.openUserDialog.bind(this)} leftIcon={<Person color={white}/>}/>
            <MenuItem primaryText="Log out" onClick={this.props.logout.bind(this)} leftIcon={<LogOut color={white}/>}/>
          </Menu>
        </Popover>
        <OptionsDialog 
          userData={this.props.userData}
          open={this.props.optionsDialogOpen}
          closeOptionsDialog={this.props.closeOptionsDialog}
          saveOptions={this.props.saveOptions}
          savingOptions={this.props.savingOptions}
        />
        <UserDialog 
          userData={this.props.userData}
          open={this.state.userDialogOpen}
          closeUserDialog={this.closeUserDialog.bind(this)}
          updateUser={this.props.updateUser}
        />
      </React.Fragment>
    );
  }
}

export default UserMenu;
