import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class RendererSelector extends React.Component {
    handleChange(event, index, value) {
        this.props.changeValue(value);
    }
    render() {
        let primaryText;
        let c = this.props.values.map((item) => {
            if (typeof(item) === 'string') {
                primaryText = item.substr(0, 1).toUpperCase().concat(item.replace("_", " ").substr(1)); // sentence case and replace _ with space
            }
            else {
                primaryText = item.toString();
            }
            return <MenuItem value={item} key={item} primaryText={primaryText}/>;
        });
        return (
            <SelectField selectionRenderer={this.props.selectionRenderer} menuItemStyle={{fontSize:'12px'}} labelStyle={{fontSize:'12px'}} listStyle={{fontSize:'12px'}} style={{width:'150px', margin: '0px 10px'}} autoWidth={true} floatingLabelText={this.props.floatingLabelText} floatingLabelFixed={true} children={c} onChange={this.handleChange.bind(this)} value={this.props.property}/>
        );
    }
}

export default RendererSelector;
