import React from 'react';
import Toggle from 'material-ui/Toggle';

class MarxanToggle extends React.Component {
    render() {
        //if a style is passed in, then override the default style
        let style = (this.props.style) ? this.props.style : {display:'inline-block', width:'20px',verticalAlign:'middle'};
        return (
            <Toggle {...this.props} style={style} trackStyle={{height:'8px',width:'22px'}} thumbStyle={{width:'13px',height:'13px'}} thumbSwitchedStyle={{left:'40%'}}/>
        );
    }
}

export default MarxanToggle;
