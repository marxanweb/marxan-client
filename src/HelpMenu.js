import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {white} from 'material-ui/styles/colors';
import {faServer} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

class HelpMenu extends React.Component {
	openDocumentation(){
		window.open(this.props.DOCS_ROOT + "docs_overview.html");
	}

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
					<MenuItem primaryText="Documentation" onClick={this.openDocumentation.bind(this)} leftIcon={<FontAwesomeIcon style={{height: '18px', marginTop:'4px',fontSize: '18px'}} icon={faQuestionCircle} color={'white'}/>}/>
					<MenuItem primaryText="Server Details" onClick={this.props.openServerDetailsDialog} leftIcon={<FontAwesomeIcon style={{height: '18px', marginTop:'4px',fontSize: '18px'}} icon={faServer} color={'white'}/>}/>
					<MenuItem primaryText="About" onClick={this.props.openAboutDialog} leftIcon={<FontAwesomeIcon style={{height: '18px', marginTop:'4px',fontSize: '18px'}} icon={faInfoCircle} color={'white'}/>}/>
				</Menu>
			</Popover>
		</React.Fragment>
	);
  }
}

export default HelpMenu;
