import React from 'react';
import MenuItem from 'material-ui/MenuItem';

class MenuItemWithButton extends React.Component {
	render() {
		return <MenuItem className={'smallMenuItem'} {...this.props} innerDivStyle={{paddingLeft:'40px'}}/>;
	}
}

export default MenuItemWithButton;
