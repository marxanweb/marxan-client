import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SvgIcon from 'material-ui/SvgIcon';

class ToolbarButton extends React.Component {
    render() {
        return (
            <RaisedButton 
                {...this.props} 
                style={{ marginLeft:'4px', marginRight:'4px',padding: '0px',minWidth: '30px',width: '24px',height: '24px'}}
                overlayStyle={{lineHeight:'24px',height:'24px'}}
                buttonStyle={{marginTop:'-7px',lineHeight:'24px',height:'24px'}} 
            />
        );
    }
}

export default ToolbarButton;
