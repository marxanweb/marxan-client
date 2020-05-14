import React from 'react';
import TextField from 'material-ui/TextField';

class MarxanTextField extends React.Component {
    render() {
        //if a style is passed in, then override the default style
        let style = (this.props.style) ? this.props.style : {display:'block'};
        return (
            <TextField 
                {...this.props}
            	inputStyle={{fontSize:'12px'}} 
            	style={style} 
            	floatingLabelFixed={true}
        	/>
        );
    }
}

export default MarxanTextField;
