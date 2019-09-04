import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Help from 'material-ui/svg-icons/action/help-outline';
import Info from 'material-ui/svg-icons/action/info';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {white} from 'material-ui/styles/colors';
import {faServer} from '@fortawesome/free-solid-svg-icons';

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
					<MenuItem primaryText="Server Details" onClick={this.props.openServerDetailsDialog} leftIcon={<FontAwesomeIcon style={{height: '16px', marginTop:'4px',fontSize: '18px'}} icon={faServer} color={'white'}/>}/>
					<MenuItem primaryText="Documentation" onClick={this.props.openDocumentation} leftIcon={<Help color={white}/>}/>
					<MenuItem primaryText="About" onClick={this.props.openAboutDialog} leftIcon={<Info color={white}/>}/>
				</Menu>
			</Popover>
		</React.Fragment>
	);
  }
}

export default HelpMenu;
