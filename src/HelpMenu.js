import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Help from 'material-ui/svg-icons/action/help-outline';
import Info from 'material-ui/svg-icons/action/info';
import {white} from 'material-ui/styles/colors';

class HelpMenu extends React.Component {
  render() {
	return (
		<React.Fragment>
			<Popover
				open={this.props.open} 
				anchorEl={this.props.menuAnchor}
				anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
				targetOrigin={{horizontal: 'left', vertical: 'top'}}
				onRequestClose={this.props.hideHelpMenu}
				>
				<Menu desktop={true} onMouseLeave={this.props.hideHelpMenu} menuItemStyle={{backgroundColor:'rgb(0, 188, 212)', color:'white'}} listStyle={{width:'120px',backgroundColor:'rgb(0, 188, 212)'}} selectedMenuItemStyle={{color:'rgb(24,24,24)'}} width={'102px'}>
					<MenuItem primaryText="Help" onClick={this.props.openHelpDialog} leftIcon={<Help color={white}/>}/>
					<MenuItem primaryText="About" onClick={this.props.openAboutDialog} leftIcon={<Info color={white}/>}/>
				</Menu>
			</Popover>
		</React.Fragment>
	);
  }
}

export default HelpMenu;
